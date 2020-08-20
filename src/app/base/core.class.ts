import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AppInjector } from '@core-modules/core';

// import { environment, EnvironmentModel } from '../config';

export class Core implements OnInit, OnDestroy {

  protected subscriptions: Subscription[] = [];

  private runSaveChangesGuard = false;

  public router: Router;
  public http: HttpClient;
  public translateService: TranslateService;
  public logger: NGXLogger;
//   public environment: EnvironmentModel;


  constructor() {
    const injector = AppInjector.getInjector();

    this.router = injector.get(Router);
    this.http = injector.get(HttpClient);
    this.translateService = injector.get(TranslateService);
    this.logger = injector.get(NGXLogger);
 //   this.environment = environment;
  }

  ngOnInit() { }

  translate(translation: string, params?: object) {
    return this.translateService.instant(translation, params);
  }


  setSaveChangesGuard(b: boolean = true) {
    this.runSaveChangesGuard = b;
  }

  canDeactivate(): boolean {
    return this.runSaveChangesGuard;
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
