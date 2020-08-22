import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { InlineSVGModule } from 'ng-inline-svg';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';


// Components.
import { BaseLayoutComponent } from './base/base-layout.component';

// // Base.
import { AsideLeftComponent } from './components/base/aside-left/aside-left.component';
import { BrandComponent } from './components/base/aside-left/brand/brand.component';

import { HeaderComponent } from './components/base/header/header.component';
import { HeaderMobileComponent } from './components/base/header/header-mobile/header-mobile.component';
import { TopbarComponent } from './components/base/header/topbar/topbar.component';
import { LanguageSelectorComponent } from './components/base/header/topbar/language-selector/language-selector.component';
import { UserProfileComponent } from './components/base/header/topbar/user-profile/user-profile.component';
import { MenuHorizontalComponent } from './components/base/header/menu-horizontal/menu-horizontal.component';

import { SubheaderComponent } from './components/base/subheader/subheader.component';

import { AsideBarComponent } from './components/base/aside-bar/aside-bar.component';

import { ModalComponent } from './components/base/modal/modal.component';
import { WizardComponent } from './components/base/wizard/wizard.component';
import { ScrollTopComponent } from './components/base/scroll-top/scroll-top.component';

// // Features.
// // Help
import { AboutModalComponent } from './components/features/help/about-modal/about-modal.component';

// // Shared.
import { ConfirmDialogComponent } from './components/shared/dialogs/confirm-dialog.component';
import { GenericDialogComponent } from './components/shared/dialogs/generic-dialog.component';
import { PageNotFoundComponent } from './components/shared/pages/not-found.component';

// Services.
import { HtmlClassService } from './services/html-class.service';

// Guards.
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

// Directives.
import { HeaderDirective } from './directives/header.directive';
import { MenuDirective } from './directives/menu.directive';
import { OffcanvasDirective } from './directives/offcanvas.directive';
import { ToggleDirective } from './directives/toggle.directive';
import { ScrollTopDirective } from './directives/scroll-top.directive';

// Pipes.
// import { FirstLetterPipe } from './pipes/first-letter.pipe';
// import { NotFoundComponent } from './components/base/not-found/not-found.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300,
};
@NgModule({
  imports: [
    SharedModule,

    ClipboardModule,
    CdkStepperModule,
    DragDropModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,

    NgxResizeObserverModule,
    InlineSVGModule,
    PerfectScrollbarModule
  ],
  declarations: [
    BaseLayoutComponent,
    // NotFoundComponent,

    // Base.
    AsideLeftComponent,
    BrandComponent,

    HeaderComponent,
    HeaderMobileComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    UserProfileComponent,
    MenuHorizontalComponent,

    SubheaderComponent,

    AsideBarComponent,

    ModalComponent,
    WizardComponent,
    ScrollTopComponent,

    // Features.
    // Help
    AboutModalComponent,

    // Shared.
    ConfirmDialogComponent,
    GenericDialogComponent,
    PageNotFoundComponent,

    // Directives.
    HeaderDirective,
    MenuDirective,
    ToggleDirective,
    OffcanvasDirective,
    ScrollTopDirective
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    HtmlClassService,

    // Guards.
    CanDeactivateGuard
  ],
  exports: [
    // SharedModule,

    ClipboardModule,
    CdkStepperModule,
    DragDropModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,

    NgxResizeObserverModule,

    BaseLayoutComponent,

    AsideLeftComponent,
    BrandComponent,

    HeaderComponent,
    HeaderMobileComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    UserProfileComponent,
    MenuHorizontalComponent,

    SubheaderComponent,

    AsideBarComponent,

    ModalComponent,
    WizardComponent,
    ScrollTopComponent,

    // Features.
    // Shared.
    // ConfirmDialogComponent,
    // GenericDialogComponent,

    // Directives.
    HeaderDirective,
    MenuDirective,
    ToggleDirective,
    OffcanvasDirective,
    ScrollTopDirective

  ]
})
export class MainThemeModule { }
