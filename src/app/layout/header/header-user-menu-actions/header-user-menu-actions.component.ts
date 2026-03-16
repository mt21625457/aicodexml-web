import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuItem} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';
import {
  APP_LANGUAGE_PREFERENCE_PATH,
  LocaleService
} from '~/shared/services/locale.service';
import {UserPreferences} from '@common/user-preferences';

@Component({
    selector: 'sm-header-user-menu-actions',
    templateUrl: './header-user-menu-actions.component.html',
    styleUrls: ['./header-user-menu-actions.component.scss'],
    imports: [MatMenuItem, MatIconModule, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuActionsComponent {
  protected localeService = inject(LocaleService);
  private userPreferences = inject(UserPreferences);
  protected currentLanguage = this.localeService.currentLanguage;

  switchLanguage(language: 'en' | 'zh-CN') {
    this.localeService.setLanguage(language).subscribe(activeLanguage => {
      if (this.userPreferences.isReady()) {
        this.userPreferences.setPreferences(APP_LANGUAGE_PREFERENCE_PATH, activeLanguage);
      }
    });
  }
}
