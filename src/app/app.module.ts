import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

// import { environment } from '@app/config';

import { CoreModule } from '@core-modules/core';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@core-modules/stores/store.module';
import { LoaderModule } from '@core-modules/catalog/modules/loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DialogsService } from '@core-modules/main-theme';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(),

    CoreModule,
    StoreModule,
    // CoreModule.forRoot({
    //   baseHref: environment.BASE_HREF
    // }),
    LoaderModule,
    MatDialogModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [DialogsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
