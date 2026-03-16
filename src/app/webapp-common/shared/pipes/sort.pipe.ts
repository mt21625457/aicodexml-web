import {inject, Pipe, PipeTransform} from '@angular/core';
import {sortByField} from '../../tasks/tasks.utils';
import {LocaleFormatService} from '~/shared/services/locale-format.service';

@Pipe({
  name: 'sort',
  })
export class SortPipe implements PipeTransform {

  transform(arr: any[], field: string): any[] {
    return field ? sortByField(arr, field) : [...arr].sort();
  }
}

@Pipe({
  name: 'sortHumanize',
})
export class SortHumanizePipe implements PipeTransform {
  private localeFormat = inject(LocaleFormatService);

  transform(array: any[], field?: string): any[] {
    const arr = [...array];
    const collator = this.localeFormat.createCollator({numeric: true, sensitivity: 'base'});
    if(field) {
      arr.sort((a, b) => collator.compare(a[field], b[field]));
    } else {
      arr.sort((a, b) => collator.compare(a, b));
    }
    return arr;
  }
}
