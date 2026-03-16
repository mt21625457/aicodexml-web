import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
    selector: 'sm-labeled-row',
    templateUrl: './labeled-row.component.html',
    styleUrls: ['./labeled-row.component.scss'],
    imports: [TranslatePipe]
})
export class LabeledRowComponent {
  @Input() label: string;
  @Input() showRow? = true;
  @Input() labelClass: string;
}
