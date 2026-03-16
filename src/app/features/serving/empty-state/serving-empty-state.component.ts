import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'sm-serving-empty-state',
    imports: [
        MatIcon,
        TranslatePipe
    ],
    templateUrl: './serving-empty-state.component.html',
    styleUrl: './serving-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServingEmptyStateComponent {
  isLoading = input<boolean>(false);
}
