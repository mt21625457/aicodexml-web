import {Pipe, PipeTransform, inject} from '@angular/core';
import {LocaleFormatService} from '~/shared/services/locale-format.service';

@Pipe({
  name: 'smDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  private localeFormat = inject(LocaleFormatService);

  transform(value: string | number | Date | null | undefined, format: string, timezone?: string): string | null {
    return this.localeFormat.formatDate(value, format, timezone);
  }
}

@Pipe({
  name: 'smNumber',
  pure: false
})
export class LocalizedNumberPipe implements PipeTransform {
  private localeFormat = inject(LocaleFormatService);

  transform(value: string | number | null | undefined, digitsInfo?: string): string | null {
    return this.localeFormat.formatNumber(value, digitsInfo);
  }
}

@Pipe({
  name: 'smPercent',
  pure: false
})
export class LocalizedPercentPipe implements PipeTransform {
  private localeFormat = inject(LocaleFormatService);

  transform(value: string | number | null | undefined, digitsInfo?: string): string | null {
    return this.localeFormat.formatPercent(value, digitsInfo);
  }
}
