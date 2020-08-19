import { NgModule } from '@angular/core';
import { ProductService } from '@features/insights/services/product.service';

import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { SharedModule } from '@shared/shared.module';


import { NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './pages/main/main.component';
import {LandingRoutingModule} from './landing-routing.module'
import { LandingComponent } from './landing.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

@NgModule({
  declarations:
      [LandingComponent, MainComponent, ForbiddenComponent],
  imports: [LandingRoutingModule, SharedModule, NgbModule],
  providers: [FormsService, LoaderService, ProductService]
})

export class LandingModule {
}
