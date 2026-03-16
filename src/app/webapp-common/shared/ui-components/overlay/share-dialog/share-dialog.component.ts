import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import {IShareDialogConfig} from './share-dialog.model';
import {addMessage} from '@common/core/actions/layout.actions';
import {Store} from '@ngrx/store';
import {shareSelectedExperiments} from '@common/experiments/actions/common-experiments-menu.actions';
import {MESSAGES_SEVERITY} from '@common/constants';
import {DialogTemplateComponent} from '@common/shared/ui-components/overlay/dialog-template/dialog-template.component';
import {ClipboardModule} from 'ngx-clipboard';
import {ClickStopPropagationDirective} from '@common/shared/ui-components/directives/click-stop-propagation.directive';
import {SaferPipe} from '@common/shared/pipes/safe.pipe';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'sm-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss'],
    imports: [
        DialogTemplateComponent,
        ClipboardModule,
        ClickStopPropagationDirective,
        SaferPipe,
        MatIcon,
        MatButton,
        MatDialogActions,
        TranslatePipe
    ]
})
export class ShareDialogComponent {

  displayX = true;

  title: string;

  public subTitle: string;
  public link: string;
  shared = false;
  public sharedSubtitle: string;
  public privateSubtitle: string;
  private readonly task: string;
  private translate = inject(TranslateService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: IShareDialogConfig,
              public dialogRef: MatDialogRef<ShareDialogComponent>,
              private store: Store) {
    this.title = data.title || '';
    this.sharedSubtitle = this.translate.instant('shared.shareReadOnly');
    this.privateSubtitle =  this.translate.instant('shared.shareCreateLink');
    this.task = data.task;

    this.link = data.link || '';
    this.shared = !!data.alreadyShared;
  }

  closeDialog(isConfirmed) {
    this.dialogRef.close({isConfirmed, shared: this.shared});
  }

  copyToClipboardSuccess() {
    this.store.dispatch(addMessage(MESSAGES_SEVERITY.SUCCESS, this.translate.instant('shared.urlCopied')));
  }

  createLink() {
    this.store.dispatch(shareSelectedExperiments({share: !this.shared, task: this.task}));

    this.shared = !this.shared;
  }
}
