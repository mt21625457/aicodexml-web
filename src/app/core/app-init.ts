import {LoginService} from '~/shared/services/login.service';
import {ConfigurationService} from '@common/shared/services/configuration.service';
import {combineLatest, switchMap} from 'rxjs';
import {inject} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {LocaleService} from '~/shared/services/locale.service';

export const loadUserAndPreferences = ()=>
  new Promise((resolve) => {
    const loginService = inject(LoginService);
    const confService = inject(ConfigurationService);
    const localeService = inject(LocaleService);

    combineLatest([
      confService.initConfigurationService(),
      loginService.initCredentials()
    ])
      .pipe(
        switchMap(() => localeService.init()),
        switchMap(() => loginService.loginFlow()),
        finalize(() => resolve(null))
      )
      .subscribe((url: string) => {
        if (url) {
          window.history.replaceState(window.history.state, '', url);
        }
      });
  });
