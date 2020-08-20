import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { AppInjector } from '@core-modules/core';

export class Animations {

  public loader: NgxSpinnerService;
  public notification: ToastrService;

  constructor() {

    const injector = AppInjector.getInjector();

    this.loader = injector.get(NgxSpinnerService);
    this.notification = injector.get(ToastrService);

  }

  showPageLoader() {
    this.loader.show('appPageLoader');
  }

  hidePageLoader() {
    this.loader.hide('appPageLoader');
  }

}
