#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scanRoot = path.join(repoRoot, 'src', 'app');
const baselinePath = path.join(repoRoot, 'scripts', 'i18n-guardrail-baseline.json');

const args = new Set(process.argv.slice(2));
const updateBaseline = args.has('--update-baseline');

const FILE_EXTENSIONS = new Set(['.ts', '.html']);
const UI_PROPERTY_NAMES = [
  'label',
  'title',
  'header',
  'subHeader',
  'pageHeader',
  'placeholder',
  'placeHolder',
  'tooltip',
  'message',
  'body',
  'caption',
  'searchPlaceholder',
  'itemLabel',
  'topTitle',
  'sectionsTitle',
  'closedCodeLabel'
];

const bindingAttributes = [
  'label',
  'header',
  'placeholder',
  'placeHolder',
  'title',
  'smTooltip',
  'searchPlaceholder',
  'itemLabel',
  'topTitle',
  'sectionsTitle',
  'fixedOptionsSubheader'
];

const propertyPattern = new RegExp(
  String.raw`(?:\b(?:${UI_PROPERTY_NAMES.join('|')})\b\s*:\s*)(['"\`])((?:\\.|(?!\1).)*)\1`,
  'g'
);

const boundAttributePattern = new RegExp(
  String.raw`(?:\[?(?:${bindingAttributes.join('|')})\]?=)(['"])((?:\\.|(?!\1).)*)\1`,
  'g'
);

const safeValuePatterns = [
  /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)+$/,
  /^(?:https?:\/\/|mailto:|\/|\.\/|\.\.\/)/i,
  /^(?:al-ico-|pi pi-|mat-|sm-|cdk-)/,
  /^[a-z0-9_./-]+$/,
  /^[A-Z0-9_./-]+$/,
  /^\{\{.*\}\}$/,
  /^[^A-Za-z]*$/,
  /^\$\{.*\}$/,
  /^assets\//,
  /^[_-]+$/,
  /^(?:json|csv|png|svg|pdf)$/i
];

const safeContainsPatterns = [
  /\|\s*translate\b/,
  /translate\s*:/,
  /\bfontIcon\b/,
  /\brouterLink\b/,
  /\bfeatureLink\b/,
  /\bfeatureName\b/,
  /\bicon\b/,
  /\burl\b/,
  /\bhref\b/,
  /\bclass\b/,
  /\bdata-id\b/,
  /\bstandalone\b/,
  /\bmatMenuTriggerFor\b/,
  /\bngModel\b/
];

const htmlTextSafePatterns = [
  /^\s*$/,
  /^\s*\{\{.*\}\}\s*$/,
  /^\s*@(?:if|for|switch|case|default|else)\b/,
  /^\s*done\s*$/,
  /^\s*ClearML\s*$/,
  /^\s*GitHub\s*$/,
  /^\s*Star\s*$/,
  /^\s*[A-Za-z0-9_,.:'"!?/&()\-+% ]+\|\s*translate.*$/,
  /^\s*[{}\[\]();,.]+$/
];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'build') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    const extension = path.extname(entry.name);
    if (!FILE_EXTENSIONS.has(extension) || entry.name.endsWith('.spec.ts')) {
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function getLineNumber(content, startIndex) {
  let line = 1;
  for (let i = 0; i < startIndex; i += 1) {
    if (content.charCodeAt(i) === 10) {
      line += 1;
    }
  }
  return line;
}

function normalizeValue(value) {
  return value
    .replace(/\\'/g, '\'')
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSafeValue(value, context) {
  if (!/[A-Za-z]/.test(value)) {
    return true;
  }

  if (safeValuePatterns.some((pattern) => pattern.test(value))) {
    return true;
  }

  if (safeContainsPatterns.some((pattern) => pattern.test(context))) {
    return true;
  }

  return false;
}

function createFinding({filePath, type, line, value}) {
  const relativePath = path.relative(repoRoot, filePath);
  return {
    key: `${relativePath}|${type}|${value}`,
    path: relativePath,
    type,
    line,
    value
  };
}

function collectPropertyFindings(filePath, content) {
  const findings = [];

  for (const pattern of [propertyPattern, boundAttributePattern]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const context = match[0];
      const value = normalizeValue(match[2]);
      if (!value || isSafeValue(value, context)) {
        continue;
      }

      findings.push(createFinding({
        filePath,
        type: 'ui-property',
        line: getLineNumber(content, match.index),
        value
      }));
    }
  }

  return findings;
}

function collectHtmlTextFindings(filePath, content) {
  if (path.extname(filePath) !== '.html') {
    return [];
  }

  const findings = [];
  const pattern = />([^<]+)</g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const value = normalizeValue(match[1]);
    if (!/[A-Za-z]/.test(value)) {
      continue;
    }
    if (htmlTextSafePatterns.some((candidate) => candidate.test(value))) {
      continue;
    }
    findings.push(createFinding({
      filePath,
      type: 'html-text',
      line: getLineNumber(content, match.index),
      value
    }));
  }

  return findings;
}

function collectFindings() {
  const findings = [];
  const files = walk(scanRoot);

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    findings.push(...collectPropertyFindings(filePath, content));
    findings.push(...collectHtmlTextFindings(filePath, content));
  }

  const unique = new Map();
  for (const finding of findings) {
    if (!unique.has(finding.key)) {
      unique.set(finding.key, finding);
    }
  }
  return [...unique.values()].sort((left, right) => left.key.localeCompare(right.key));
}

function readBaseline() {
  if (!fs.existsSync(baselinePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
}

function writeBaseline(findings) {
  const payload = {
    updatedAt: new Date().toISOString(),
    scope: 'src/app/**/*.{ts,html}',
    findings: findings.map(({key, path: filePath, type, value}) => ({
      key,
      path: filePath,
      type,
      value
    }))
  };
  fs.writeFileSync(baselinePath, `${JSON.stringify(payload, null, 2)}\n`);
}

const findings = collectFindings();

if (updateBaseline) {
  writeBaseline(findings);
  console.log(`Updated i18n guardrail baseline with ${findings.length} entries.`);
  process.exit(0);
}

const baseline = readBaseline();
const baselineKeys = new Set((baseline.findings || []).map((entry) => entry.key));
const newFindings = findings.filter((finding) => !baselineKeys.has(finding.key));

if (newFindings.length === 0) {
  console.log(`i18n guardrail passed. No new hard-coded UI strings were detected in ${path.relative(repoRoot, scanRoot)}.`);
  process.exit(0);
}

console.error(`i18n guardrail failed. Found ${newFindings.length} new potential hard-coded UI string(s):`);
for (const finding of newFindings) {
  console.error(`- ${finding.path}:${finding.line} [${finding.type}] ${JSON.stringify(finding.value)}`);
}
console.error('');
console.error('If a finding is intentional and safe, update the baseline with:');
console.error('  npm run i18n:guardrail:update-baseline');
process.exit(1);
