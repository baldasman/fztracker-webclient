import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { EnvironmentStore, SystemStore } from '@core-modules/stores';

import { DialogsService } from '@core-modules/main-theme/services/dialogs.service';

@Component({
  selector: 'main-theme-header-topbar-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userInfo = this.environmentStore.getAuthenticationInfo();
  firstName: string;
  firstNameLetter: string;

  constructor(
    private dialogsService: DialogsService,
    private environmentStore: EnvironmentStore,
    private router: Router,
    private systemStore: SystemStore,
    private t: TranslateService
  ) {}

  ngOnInit() {
    this.firstName = this.userInfo.user.name.split(' ')[0];
    this.firstNameLetter = this.userInfo.user.name[0].toUpperCase();
  }

  signOut() {
    if (this.systemStore.getSystem() && this.systemStore.getSystem().isDirty) {
      this.dialogsService.openConfirmationDialog({
        title: this.t.instant('shared.dialogs.unsaved_changes.title'),
        message: this.t.instant('shared.dialogs.unsaved_changes.message'),
        confirmText: this.t.instant('shared.dialogs.unsaved_changes.confirm_text'),
        cancelText: this.t.instant('shared.dialogs.unsaved_changes.cancel_text')
      }).subscribe((result) => {
        if (result) {
          this.finishSignOut();
        }
      });
    } else {
      this.finishSignOut();
    }
  }

  finishSignOut() {
    this.environmentStore.clearStore();
    this.systemStore.clearStore();
    this.router.navigateByUrl('auth/signout');
  }

}
