import {DOCUMENT} from '@angular/common';
import {computed, inject, Injectable, signal} from '@angular/core';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateService
} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {ConfigurationService} from '@common/shared/services/configuration.service';

export const APP_LANGUAGE_STORAGE_KEY = '_APP_LANGUAGE_';
export const DEFAULT_APP_LANGUAGE = 'en';
export const SUPPORTED_APP_LANGUAGES = ['en', 'zh-CN'] as const;
export type AppLanguage = typeof SUPPORTED_APP_LANGUAGES[number];

@Injectable()
export class FriendlyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const fallback = params.key?.split('.').pop() ?? 'Missing translation';
    return fallback
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);
  private configurationService = inject(ConfigurationService);

  private currentLanguageState = signal<AppLanguage>(DEFAULT_APP_LANGUAGE);
  private initialized = false;

  readonly currentLanguage = this.currentLanguageState.asReadonly();
  readonly supportedLanguages = computed(() => this.getConfiguredSupportedLanguages());

  init(): Observable<AppLanguage> {
    const language = this.resolveInitialLanguage();

    this.translate.addLangs(this.supportedLanguages() as unknown as string[]);

    return this.translate.setFallbackLang(DEFAULT_APP_LANGUAGE).pipe(
      switchMap(() => this.translate.use(language)),
      tap(() => this.applyLanguage(language)),
      map(() => language)
    );
  }

  setLanguage(language: string): Observable<AppLanguage> {
    const normalized = this.normalizeLanguage(language);
    if (this.initialized && this.currentLanguage() === normalized) {
      return of(normalized);
    }

    return this.translate.use(normalized).pipe(
      tap(() => this.applyLanguage(normalized)),
      map(() => normalized)
    );
  }

  languageLabel(language: AppLanguage): string {
    return language === 'zh-CN' ? '简体中文' : 'English';
  }

  private applyLanguage(language: AppLanguage): void {
    this.currentLanguageState.set(language);
    this.initialized = true;
    localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
    this.document.documentElement.lang = language;
    this.document.documentElement.setAttribute('data-language', language);
  }

  private resolveInitialLanguage(): AppLanguage {
    const configuredDefault = this.getConfiguredDefaultLanguage();
    const candidates = [
      localStorage.getItem(APP_LANGUAGE_STORAGE_KEY),
      configuredDefault,
      navigator.language,
      ...navigator.languages
    ];

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }
      return this.normalizeLanguage(candidate);
    }

    return DEFAULT_APP_LANGUAGE;
  }

  private normalizeLanguage(language: string): AppLanguage {
    const value = language.toLowerCase();
    if (value.startsWith('zh')) {
      return 'zh-CN';
    }
    return DEFAULT_APP_LANGUAGE;
  }

  private getConfiguredDefaultLanguage(): string | undefined {
    const configuration = this.configurationService.configuration() as {
      defaultLanguage?: string;
    };

    return configuration.defaultLanguage;
  }

  private getConfiguredSupportedLanguages(): AppLanguage[] {
    const configuration = this.configurationService.configuration() as {
      supportedLanguages?: string[];
    };
    const configured = configuration.supportedLanguages
      ?.map((language) => this.normalizeLanguage(language));

    return configured?.length
      ? Array.from(new Set(configured))
      : [...SUPPORTED_APP_LANGUAGES];
  }
}
