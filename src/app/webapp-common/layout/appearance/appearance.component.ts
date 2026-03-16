import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import { DialogTemplateComponent } from '../../shared/ui-components/overlay/dialog-template/dialog-template.component';
import { selectUserTheme } from '@common/core/reducers/view.reducer';
import { Store } from '@ngrx/store';
import { userThemeChanged } from '@common/core/actions/layout.actions';
import {NgOptimizedImage} from '@angular/common';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {TranslatePipe} from '@ngx-translate/core';

interface Themes {
  value: 'light' | 'dark' | 'system';
  nameKey: string;
}

@Component({
    selector: 'sm-appearance',
    templateUrl: './appearance.component.html',
    styleUrls: ['./appearance.component.scss'],
    imports: [
        DialogTemplateComponent,
        NgOptimizedImage,
        MatSelectionList,
        MatListOption,
        FormsModule,
        TranslatePipe,
    ]
})
export class AppearanceComponent {
  themes: Themes[] = [
    {value: 'light', nameKey: 'appearance.light'},
    {value: 'dark', nameKey: 'appearance.dark'},
    {value: 'system', nameKey: 'appearance.system'},
  ];
  private store = inject(Store);
  protected userTheme = this.store.selectSignal(selectUserTheme);


  setUserTheme(theme: 'light' | 'dark' | 'system') {
    this.store.dispatch(userThemeChanged({theme}));
  }

}
