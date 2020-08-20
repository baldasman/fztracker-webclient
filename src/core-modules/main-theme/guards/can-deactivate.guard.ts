import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DialogsService } from '../services/dialogs.service';

interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private translateService: TranslateService,
    private dialogsService: DialogsService
  ) { }

  canDeactivate(component: CanComponentDeactivate) {

    if (component.canDeactivate()) {

      return this.dialogsService.openConfirmationDialog({
        title: this.translateService.instant('shared.dialogs.unsaved_changes.title'),
        message: this.translateService.instant('shared.dialogs.unsaved_changes.message'),
        confirmText: this.translateService.instant('shared.dialogs.unsaved_changes.confirm_text'),
        cancelText: this.translateService.instant('shared.dialogs.unsaved_changes.cancel_text')
      }).toPromise().then(event => event ? true : false);

    }

    return true;

  }

}
