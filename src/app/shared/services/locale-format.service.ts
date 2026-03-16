import {formatDate, formatNumber, formatPercent} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {LocaleService} from '~/shared/services/locale.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleFormatService {
  private localeService = inject(LocaleService);

  formatDate(value: string | number | Date | null | undefined, format: string, timezone?: string): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    try {
      return formatDate(value, format, this.localeService.angularLocale(), timezone);
    } catch {
      return null;
    }
  }

  formatNumber(value: string | number | null | undefined, digitsInfo?: string): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(numericValue)) {
      return `${value}`;
    }

    return formatNumber(numericValue, this.localeService.angularLocale(), digitsInfo);
  }

  formatPercent(value: string | number | null | undefined, digitsInfo?: string): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(numericValue)) {
      return `${value}`;
    }

    return formatPercent(numericValue, this.localeService.angularLocale(), digitsInfo);
  }

  createCollator(options?: Intl.CollatorOptions): Intl.Collator {
    return new Intl.Collator(this.localeService.intlLocale(), options);
  }

  naturalCompare(a: string, b: string): number {
    const aFloat = parseFloat(a);
    const bFloat = parseFloat(b);
    if (!Number.isNaN(aFloat) && !Number.isNaN(bFloat)) {
      return aFloat - bFloat;
    }

    return this.createCollator({numeric: true, sensitivity: 'base'}).compare(a, b);
  }
}
