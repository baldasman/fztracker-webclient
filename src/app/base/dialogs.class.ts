import { MatDialog } from '@angular/material/dialog';

import { AppInjector } from '@core-modules/core';

// import { ModalsService } from '@core-modules/main-theme';

export class Dialogs {

  public dialog: MatDialog;
  // public modalsService: ModalsService;

  constructor() {

    const injector = AppInjector.getInjector();

    this.dialog = injector.get(MatDialog);
    // this.modalsService = injector.get(ModalsService);

  }

}
