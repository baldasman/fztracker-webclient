import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { EnvironmentService } from '@core/services/environment.service';
import { FormsService } from '@shared/catalog/forms/services/forms.service';
import { LoaderService } from '@shared/catalog/loader/services/loader.service';
import { SignInService } from '@sign-in/services/sign-in.service';

@Component({
  selector: 'app-page-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];
  private nextUrl: string;

  public signInForm: FormGroup;
  public url: string;
  public userEmail: string;

  public showResendEmailButton = false;
  public successMessage = {
    visible: false,
    text: '',
  };

  public contentReady = false;
  public hasValidToken = false;
  public errors = [];

  get f() { return this.signInForm.controls; }

  constructor(
    private environmentService: EnvironmentService,
    private fb: FormBuilder,
    private formsService: FormsService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private signInService: SignInService,
    private t: TranslateService
  ) {
    this.url = this.environmentService.getConfigurations()['domain'].url;
  }

  resendConfirmationEmail() {
    return this.signInService.resendConfirmationEmail({ email: this.signInForm.controls.email.value });
  }

  ngOnInit() {
    this.loaderService.start('signInContent');
    this.signInForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

    if (this.route.snapshot.queryParams.logout) {
      localStorage.removeItem('token');
    }

    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      try {
        this.userEmail = JSON.parse(atob(token.split('.')[1])).authId;
      } catch (e) {
        localStorage.removeItem('token');
      }

      this.signInService.verifyToken().subscribe(
        () => {
          this.draw(true);
        },
        () => {
          this.signInForm.get('email').setValue(this.userEmail);
          this.draw(false);
        }
      );
    } else {
      this.draw(false);
    }
  }

  ngAfterViewInit() { }

  draw(tokenValid) {
    this.hasValidToken = tokenValid;
    if (this.route.snapshot.queryParams.referrer) {
      this.nextUrl = this.route.snapshot.queryParams.referrer;
    } else {
      const protocol = this.environmentService.getConfigurations()['domain'].protocol;
      this.nextUrl = `${protocol}://${this.url}`;
    }

    if (document.referrer) {
      const ref = document.referrer.split('/');
      if (ref[2] && !ref[2].startsWith('accounts')) {
        this.nextUrl = document.referrer;
      }
    }
    this.contentReady = true;
    this.loaderService.stop('signInContent');
  }

  onActiveAccountLogIn() {
    this.loaderService.start('signInContent');

    this.observablesSubscriptions.push(
      this.signInService.verifyToken().subscribe(
        (response) => {
          response['data'].token = localStorage.getItem('token');
          this.onUserLogged(response);
        },
        (errorResponse) => {
          this.onErrorAuthenticatingUser(errorResponse);
        }
      )
    );
  }

  onOtherAccountLogIn() {
    this.hasValidToken = false;
  }

  onUserLogged(response) {
    this.contentReady = true;
    this.loaderService.stop('signInContent');
    // window.location.href = `${this.nextUrl || '/'}`;
    window.location.href = '/';
  }

  onErrorAuthenticatingUser(errorResponse) {
    this.signInForm.get('password').reset();
    this.errors = [errorResponse.error.resultMessage];

    if (errorResponse.error.resultCode === 423) {
      this.showResendEmailButton = true;
    }
    this.contentReady = true;
    this.loaderService.stop('signInContent');
  }

  validateForm() {
    if (this.signInForm.valid) {
      this.loaderService.start('signInContent');
      this.errors = [];
      this.successMessage.visible = false;
      this.showResendEmailButton = false;

      this.observablesSubscriptions.push(
        this.signInService.signIn({ authId: this.signInForm.value.email, password: this.signInForm.value.password, sessionType: "WebClient" }).subscribe(
          (response) => {
            localStorage.setItem('token', response['data'].token);
            
            // Save addtional user info
            localStorage.setItem('email', response['data'].email);
            localStorage.setItem('name', response['data'].name);
            localStorage.setItem('isAdmin', response['data'].isAdmin);

            this.onUserLogged(response);
          },
          (errorResponse) => {
            this.onErrorAuthenticatingUser(errorResponse);
          }
        )
      );
    } else {
      this.formsService.showErrors(this.signInForm);
    }
  }

  resendEmail() {
    this.loaderService.start('signInContent');
    this.observablesSubscriptions.push(
      this.resendConfirmationEmail().subscribe(
        () => {
          this.errors = [];
          this.successMessage.visible = true;
          this.loaderService.stop('signInContent');
        },
        () => {
          this.errors = [this.t.instant('auth.messages.errors.something_went_wrong')];
          this.loaderService.stop('signInContent');
        }
      )
    );
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    );
  }
}
