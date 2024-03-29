import { NgModule, APP_INITIALIZER, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MqttModule } from 'ngx-mqtt';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

// Services.
import { AuthenticationService } from './services/authentication.service';

// Interceptors.
import { ApiInInterceptor } from './interceptors/api-in.interceptor';
import { ApiOutInterceptor } from './interceptors/api-out.interceptor';

// Guards.
import { AuthenticationGuard } from './guards/authentication.guard';

// Resolvers.
import { StoresResolver } from './resolvers/stores.resolver';

// Models.
import { environment } from '../../app/config'; // TODO: import this in another way!!


// Initialize LayoutConfigService.
import { LayoutConfig } from '../main-theme/_config/layout.config';
import { LayoutConfigService } from '../main-theme/services/layout-config.service';
import { CardsService } from './services/cards.service';
import { EntityService } from './services/entity.service';
import { GunsService } from './services/guns.service';
import { MovementsService } from './services/movements.service';
import { AnalyticsService } from './services/analytics.service';
import { AdminGuard } from './guards/admin.guard';
import { InstGuard } from './guards/inst.guard';
import { PersonalGuard } from './guards/personal.guard';


export function initializeLayoutConfig(appConfig: LayoutConfigService) {
  return () => { appConfig.loadConfiguration(new LayoutConfig().configs); };
}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,

    MqttModule.forRoot({ connectOnCreate: false }),

    LoggerModule.forRoot({
      level: environment.LOG_LEVEL,  // TRACE|DEBUG|INFO|LOG|WARN|ERROR|FATAL|OFF
      timestampFormat: 'mediumTime'
      // serverLoggingUrl: '/api/logs',
      // serverLogLevel: NgxLoggerLevel.ERROR
    }),

    NgxSpinnerModule,

    ToastrModule.forRoot({ closeButton: true, progressBar: true })
  ],
  providers: [
    AuthenticationService,
    CardsService,
    EntityService,
    MovementsService,
    AnalyticsService,
    GunsService,

    // TODO: add service here
    {
      // App base HREF definition.
      provide: APP_BASE_HREF,
      useValue: (environment.BASE_HREF.startsWith('/') ? '' : '/') + environment.BASE_HREF
    },
    LayoutConfigService,
    {
      // LayoutConfigService initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService], multi: true
    },


    // Interceptors.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiOutInterceptor,
      multi: true
    },

    // Guards.
    AuthenticationGuard,
    AdminGuard,
    InstGuard,
    PersonalGuard,

    // Resolvers.
    StoresResolver
  ]
})
export class CoreModule {
  // Makes sure that CoreModule is imported only by one NgModule (AppModule)!
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Core Module is already loaded. Import it only in AppModule, please!');
    }
  }

  // static forRoot(config: CoreInit): ModuleWithProviders {
  //   return {
  //     ngModule: CoreModule,
  //     providers: [
  //     {
  //       // App base HREF definition.
  //       provide: APP_BASE_HREF,
  //       useValue: (config.baseHref.startsWith('/') ? '' : '/') + config.baseHref
  //     }
  //     ]
  //   }
  // }
}


// interface CoreInit {
//   baseHref: string;
// }
