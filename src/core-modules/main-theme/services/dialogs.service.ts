import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../components/shared/dialogs/confirm-dialog.component';
import { GenericDialogComponent } from '../components/shared/dialogs/generic-dialog.component';


@Injectable()
export class DialogsService {

  constructor(
    private dialog: MatDialog,
    private t: TranslateService
  ) { }


  public openConfirmationDialog(options: {
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string
  }): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText || upperFirst(this.t.instant('dictionary.cancel')),
        confirmText: options.confirmText || upperFirst(this.t.instant('dictionary.confirm'))
      }
    }).afterClosed().pipe(take(1), map(response => response));
  }

  public openInformationDialog(options: {
    title: string,
    message: string,
    closeText?: string
  }): Observable<boolean> {
    return this.dialog.open(GenericDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        actions: [{ id: 'OK', class: 'btn-primary', label: options.closeText || upperFirst(this.t.instant('dictionary.ok')) }],
      }
    }).afterClosed().pipe(take(1), map(response => response === 'OK'));
  }

}
