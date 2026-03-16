import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AdminCredentialTableBaseDirective} from '../admin-credential-table.base';
import {TIME_FORMAT_STRING} from '@common/constants';
import {TooltipDirective} from '@common/shared/ui-components/indicators/tooltip/tooltip.directive';
import {TimeAgoPipe} from '@common/shared/pipes/timeAgo';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {LocalizedDatePipe} from '@common/shared/pipes/localized-format.pipe';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'sm-admin-credential-table',
  templateUrl: './admin-credential-table.component.html',
  styleUrls: ['./admin-credential-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TooltipDirective,
    LocalizedDatePipe,
    TimeAgoPipe,
    MatIconButton,
    MatIconModule,
    TranslatePipe
  ]
})
export class AdminCredentialTableComponent extends AdminCredentialTableBaseDirective {
  timeFormatString = TIME_FORMAT_STRING;
}
