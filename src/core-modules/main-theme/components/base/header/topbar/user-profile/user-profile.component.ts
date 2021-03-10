import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsService } from '@core-modules/main-theme/services/dialogs.service';
import { EnvironmentStore } from '@core-modules/stores';
import { TranslateService } from '@ngx-translate/core';


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
    private t: TranslateService
  ) { }

  ngOnInit() {

    const nameParts = this.userInfo.user.name.split(' ');
    this.firstName = nameParts[nameParts.length-1];
    this.firstNameLetter = this.userInfo.user.name[0].toUpperCase();
  }

  signOut() {
    this.finishSignOut();
  }

  finishSignOut() {
    this.environmentStore.clearStore();
    this.router.navigateByUrl('auth/signout');
  }

}
