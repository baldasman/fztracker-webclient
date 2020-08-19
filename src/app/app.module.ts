import { environment } from '@app/config/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AuthGuard } from '@core/guards/auth.guard';
import { UsersService } from '@core/services/users.service';
import { AdminGuard } from '@core/guards/admin.guard';

export function httpLoaderFactory(http: HttpClient) { return new TranslateHttpLoader(http, `${environment.apiUrl}assets/i18n/`); }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [AuthGuard, AdminGuard, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
