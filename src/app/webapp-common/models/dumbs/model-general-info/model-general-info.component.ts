import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  viewChild
} from '@angular/core';
import {get} from 'lodash-es';
import {SelectedModel} from '../../shared/models.model';
import {TAGS} from '@common/tasks/tasks.constants';
import {TIME_FORMAT_STRING} from '@common/constants';
import {Store} from '@ngrx/store';
import {activateModelEdit, cancelModelEdit} from '../../actions/models-info.actions';
import {AdminService} from '~/shared/services/admin.service';
import {getSignedUrl} from '@common/core/actions/common-auth.actions';
import {selectSignedUrl} from '@common/core/reducers/common-auth-reducer';
import {filter, map, take} from 'rxjs/operators';
import {InlineEditComponent} from '@common/shared/ui-components/inputs/inline-edit/inline-edit.component';
import {CopyClipboardComponent} from '@common/shared/ui-components/indicators/copy-clipboard/copy-clipboard.component';
import {LabeledRowComponent} from '@common/shared/ui-components/data/labeled-row/labeled-row.component';
import {RouterLink} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NAPipe} from '@common/shared/pipes/na.pipe';
import {LocaleFormatService} from '~/shared/services/locale-format.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'sm-model-general-info',
  templateUrl: './model-general-info.component.html',
  styleUrls: ['./model-general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InlineEditComponent,
    CopyClipboardComponent,
    CopyClipboardComponent,
    LabeledRowComponent,
    LabeledRowComponent,
    MatIconModule,
    RouterLink,
    MatIconButton,
    NAPipe,
    TranslatePipe
  ]
})
export class ModelGeneralInfoComponent {
  private store = inject(Store);
  private adminService = inject(AdminService);
  private localeFormat = inject(LocaleFormatService);
  private translate = inject(TranslateService);

  public kpis: { label: string; value: string; downloadable?: boolean; href?: string; task?: string }[];
  private _model: SelectedModel;
  public isLocalFile: boolean;
  protected description = viewChild(InlineEditComponent);

  @Input() editable: boolean;
  @Input() projectId: string;

  @Input() set model(model: SelectedModel) {
    if (this._model?.id !== model?.id) {
      this.description().inlineCanceled();
    }
    this._model = model;
    const unavailable = this.translate.instant('shared.notAvailable');
    if (model) {
      this.isLocalFile = this.adminService.isLocalFile(model.uri);
      this.kpis = [
        {label: this.translate.instant('models.generalInfo.createdAt'), value: this.localeFormat.formatDate(model.created, TIME_FORMAT_STRING) || this.translate.instant('shared.notAvailable')},
        {label: this.translate.instant('models.generalInfo.updatedAt'), value: this.localeFormat.formatDate(model.last_update, TIME_FORMAT_STRING) || this.translate.instant('shared.notAvailable')},
        {label: this.translate.instant('models.generalInfo.framework'), value: model.framework || unavailable},
        {label: this.translate.instant('models.generalInfo.status'), value: (model.ready !== undefined) ? (model.ready ? this.translate.instant('models.values.published') : this.translate.instant('models.values.draft')) : unavailable},
        {label: this.translate.instant('models.generalInfo.modelUrl'), value: model.uri || unavailable, downloadable: true},
        {label: this.translate.instant('models.generalInfo.user'), value: get( model,'user.name', unavailable)},
        {label: this.translate.instant('models.generalInfo.archived'), value: model && model.system_tags && model.system_tags.includes(TAGS.HIDDEN) ? this.translate.instant('shared.yes') : this.translate.instant('shared.no')},
        {label: this.translate.instant('models.generalInfo.project'), value: get(model, 'project.name', unavailable)},
      ];
    } else {
      this.kpis = [
        {label: this.translate.instant('models.generalInfo.createdAt'), value: '-'},
        {label: this.translate.instant('models.generalInfo.updatedAt'), value: '-'},
        {label: this.translate.instant('models.generalInfo.framework'), value: '-'},
        {label: this.translate.instant('models.generalInfo.status'), value: '-'},
        {label: this.translate.instant('models.generalInfo.modelUrl'), value: '-'},
        {label: this.translate.instant('models.generalInfo.user'), value: '-'},
        {label: this.translate.instant('models.generalInfo.archived'), value: '-'},
        {label: this.translate.instant('models.generalInfo.project'), value: '-'},
      ];
    }
  }

  get model(): SelectedModel {
    return this._model;
  }

  @Output() commentChanged = new EventEmitter<string>();

  commentValueChanged(value) {
    this.commentChanged.emit(value);
  }

  public canShowModel() {
    return !!this.model && !'Custom'.includes(this.model.framework);
  }

  editExperimentComment(edit) {
    edit && this.store.dispatch(activateModelEdit('ModelComment'));
  }

  cancelEdit() {
    this.store.dispatch(cancelModelEdit());
  }

  downloadModelClicked() {
    const url = this.model.uri;
    this.store.dispatch(getSignedUrl({url}));
    this.store.select(selectSignedUrl(url))
      .pipe(
        filter(signed => !!signed?.signed),
        map(({signed: signedUrl}) => signedUrl),
        take(1)
      ).subscribe(signed => {
      const a = document.createElement('a') as HTMLAnchorElement;
      a.target = '_blank';
      a.href = signed;
      a.click();
    });
  }
}
