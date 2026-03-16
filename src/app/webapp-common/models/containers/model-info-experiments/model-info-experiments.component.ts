import {ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, viewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectModelId, selectSelectedModel} from '@common/models/reducers';
import {EntityTypeEnum} from '~/shared/constants/non-common-consts';
import {ExperimentsTableComponent} from '@common/experiments/dumb/experiments-table/experiments-table.component';
import {get} from 'lodash-es';
import {addMessage} from '@common/core/actions/layout.actions';
import {computedPrevious} from 'ngxtension/computed-previous';
import {IdBadgeComponent} from '@common/shared/components/id-badge/id-badge.component';
import {RouterLink} from '@angular/router';
import {
  ModelExperimentsTableComponent
} from '@common/models/containers/model-experiments-table/model-experiments-table.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'sm-model-info-experiments',
  templateUrl: './model-info-experiments.component.html',
  styleUrls: ['./model-info-experiments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IdBadgeComponent,
    RouterLink,
    ModelExperimentsTableComponent,
    TranslatePipe
  ]
})
export class ModelInfoExperimentsComponent {
  private store = inject(Store);
  private translate = inject(TranslateService);
  public entityType = EntityTypeEnum.experiment;

  table = viewChild(ExperimentsTableComponent);
  public selectedModel = this.store.selectSignal(selectSelectedModel);
  public selectedModelCreatingTaskLink = computed(() => `/projects/${get(this.selectedModel(), 'task.project.id', '*')}/tasks/${get(this.selectedModel(), 'task.id', '')}`);

  private selectedModelFromRouter = this.store.selectSignal(selectModelId);
  private selectedModelFromRouterP = computedPrevious(this.selectedModelFromRouter);

  protected model = linkedSignal(() => this.selectedModel());

  constructor() {
    effect(() => {
      if (this.selectedModelFromRouterP() !== this.selectedModelFromRouter()) {
        this.model.set(null);
      }
    });
  }

  copyToClipboard() {
    this.store.dispatch(addMessage('success', this.translate.instant('shared.idCopied')));
  }
}
