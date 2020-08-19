import { Injectable } from '@angular/core';

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class LoaderService {

  constructor(private ngxLoader: NgxUiLoaderService) { }

  start(section?: string) {
    if (section) {
      this.ngxLoader.startLoader(section);
      console.log(section);
    } else {
      this.ngxLoader.start();
    }
  }

  stop(section?: string) {
    if (section) {
      this.ngxLoader.stopLoader(section);
    } else {
      this.ngxLoader.stop();
    }
  }

  stopAll() {
    this.ngxLoader.stopAll();
  }

  // Specific sections!
  startPageContent()  { this.ngxLoader.startLoader('pageContent'); }
  stopPageContent()   { this.ngxLoader.stopLoader('pageContent'); }

}
