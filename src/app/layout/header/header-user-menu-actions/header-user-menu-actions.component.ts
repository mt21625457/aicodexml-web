import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuItem} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';
import {LocaleService} from '~/shared/services/locale.service';

@Component({
    selector: 'sm-header-user-menu-actions',
    templateUrl: './header-user-menu-actions.component.html',
    styleUrls: ['./header-user-menu-actions.component.scss'],
    imports: [MatMenuItem, MatIconModule, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuActionsComponent {
  protected localeService = inject(LocaleService);
  protected currentLanguage = this.localeService.currentLanguage;

  switchLanguage(language: 'en' | 'zh-CN') {
    this.localeService.setLanguage(language).subscribe();
  }
}
