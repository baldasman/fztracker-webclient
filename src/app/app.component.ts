import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '@core-modules/catalog/modules/loader';

import { locale as ptLanguage } from './config/translations/pt';
import { locale as enLanguage } from './config/translations/en';
import { DialogsService } from '@core-modules/main-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogsService: DialogsService,
    private loader: LoaderService,
    private router: Router,
    private titleService: Title,
    private translateService: TranslateService
  ) {
    this.translateService.addLangs(['en', 'pt']);
    this.translateService.setTranslation(ptLanguage.lang, ptLanguage.data, true);
    this.translateService.setTranslation(enLanguage.lang, enLanguage.data, true);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.titleService.setTitle(translateService.instant('app.title'));
  }

  ngOnInit() {

    this.loader.show('splash-screen-loader');

    this.subscriptions.push(
      this.router.events.subscribe(event => {

        if (event instanceof NavigationEnd) {

          this.loader.hide('splash-screen-loader'); // Hide splash screen
          window.scrollTo(0, 0); // Scroll to top on every route change

          setTimeout(() => {
            document.body.classList.add('page-loaded'); // To display back the body content
          }, 500);

        }

      })
    );

    // add event listener - storage change
    window.addEventListener('storage', (e) => this.onStorageChange(e), false);

  }

  onStorageChange(event: { key: string, newValue: string }) {
    // if token = null then logout
    if (event.key === 'token') {
      if (event.newValue === null) {

        this.dialogsService.openInformationDialog({
          title: this.translateService.instant('labels.sign_out'),
          message: this.translateService.instant('messages.informations.session_ended')
        });

        this.router.navigateByUrl('auth/signout');
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
