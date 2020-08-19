import { NgModule } from '@angular/core';
import { ProductService } from '@features/insights/services/product.service';

import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { SharedModule } from '@shared/shared.module';
import { InsightsRoutingModule } from './insights-routing.module';
import { InsightsComponent } from './insights.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations:
      [InsightsComponent, HomeComponent, DashboardComponent, StocksComponent],
  imports: [InsightsRoutingModule, SharedModule, NgbModule],
  providers: [FormsService, LoaderService, ProductService]
})

export class InsightsModule {
}
