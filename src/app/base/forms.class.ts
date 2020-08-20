import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AppInjector } from '@core-modules/core';

import { FormsService } from '@core-modules/catalog/modules/forms';

export class Forms {

  formBuilder: FormBuilder;
  formService: FormsService;

  constructor() {

    const injector = AppInjector.getInjector();

    this.formBuilder = new FormBuilder();
    this.formService = new FormsService(injector.get(TranslateService));

  }

}
