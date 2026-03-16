import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {TIME_FORMAT_STRING} from '@common/constants';
import {ProjectCardComponent} from '@common/shared/ui-components/panel/project-card/project-card.component';
import {CircleCounterComponent} from '@common/shared/ui-components/indicators/circle-counter/circle-counter.component';
import {CardComponent} from '@common/shared/ui-components/panel/card/card.component';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TooltipDirective} from '@common/shared/ui-components/indicators/tooltip/tooltip.directive';
import {BreadcrumbsEllipsisPipe} from '@common/shared/pipes/breadcrumbs-ellipsis.pipe';
import {InlineEditComponent} from '@common/shared/ui-components/inputs/inline-edit/inline-edit.component';
import {ShortProjectNamePipe} from '@common/shared/pipes/short-project-name.pipe';
import {CleanProjectPathPipe} from '@common/shared/pipes/clean-project-path.pipe';
import {TimeAgoPipe} from '@common/shared/pipes/timeAgo';
import {TagListComponent} from '@common/shared/ui-components/tags/tag-list/tag-list.component';
import {ClickStopPropagationDirective} from '@common/shared/ui-components/directives/click-stop-propagation.directive';
import {ShowTooltipIfEllipsisDirective} from '@common/shared/ui-components/indicators/tooltip/show-tooltip-if-ellipsis.directive';
import {PipelineCardMenuComponent} from '@common/pipelines/pipeline-card-menu/pipeline-card-menu.component';
import {LocalizedDatePipe} from '@common/shared/pipes/localized-format.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'sm-pipeline-card',
    templateUrl: './pipeline-card.component.html',
    styleUrls: ['./pipeline-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CircleCounterComponent,
    CardComponent,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    TooltipDirective,
    BreadcrumbsEllipsisPipe,
    CdkFixedSizeVirtualScroll,
    InlineEditComponent,
    ShortProjectNamePipe,
    CleanProjectPathPipe,
    LocalizedDatePipe,
    TimeAgoPipe,
    TagListComponent,
    ClickStopPropagationDirective,
    ShowTooltipIfEllipsisDirective,
    PipelineCardMenuComponent,
    TranslatePipe,
  ]
})
export class PipelineCardComponent extends ProjectCardComponent {
  protected readonly timeFormatString = TIME_FORMAT_STRING;
  allTags = input<string[]>();
  run = output();
  addTag = output<string>();
  removeTag = output<string>();
  delete = output();
}
