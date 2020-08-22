import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderModule } from '@core-modules/catalog/modules/loader';
// import { environment } from '@app/config';
import { CoreModule } from '@core-modules/core';
import { DialogsService } from '@core-modules/main-theme';
import { StoreModule } from '@core-modules/stores/store.module';
import { TranslateModule } from '@ngx-translate/core';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './config';


const config: SocketIoConfig = { url: `${environment.WS_PROTOCOL}://${environment.WS_HOSTNAME}:${environment.WS_PORT}`, options: {} };

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
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  declarations: [AppComponent],
  providers: [DialogsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
