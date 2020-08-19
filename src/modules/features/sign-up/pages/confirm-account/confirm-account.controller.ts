import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SignUpLayoutComponent } from '@features/sign-up/components/sign-up-layout/sign-up-layout.component';

import { ConfirmAccountService } from '../../services/confirm-account.service';
import { FormsService, passwordFormatValidator, passwordFieldsMatchValidator } from '@shared/catalog/forms';
import { LoaderService } from '@shared/catalog/loader';
import { SignInService } from '@features/sign-in/services/sign-in.service';


@Component({
  selector: 'app-page-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})

export class ConfirmAccountComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(SignUpLayoutComponent, { static: false }) signUpLayout: SignUpLayoutComponent;

  private observablesSubscriptions: Subscription[] = [];
  public currentView = 'confirmAccount';
  public setPasswordForm: FormGroup;
  public confirmationCode = ['', '', '', '', '', ''];
  public token: any;
  public userEmail = '';
  public errors = [];
  public hasChanges = false;

  get f() { return this.setPasswordForm.controls; }

  constructor(
    private activeRoute: ActivatedRoute,
    private confirmAccountService: ConfirmAccountService,
    private fb: FormBuilder,
    private formsService: FormsService,
    private loaderService: LoaderService,
    private router: Router,
    private signInService: SignInService,
    private t: TranslateService
  ) {
  }

  validateConfirmationCode(code, token) {
    return this.confirmAccountService.validateConfirmationCode(code, token);
  }

  changePassword() {
    return this.confirmAccountService.changePassword({ email: this.userEmail, token: this.token, ...this.setPasswordForm.value });
  }

  resendConfirmationEmail(email) {
    return this.confirmAccountService.resendConfirmationEmail(email);
  }

  ngOnInit() {
    this.loaderService.start('confirmAccountContent');
    this.token = this.activeRoute.snapshot.params.token;

    this.setPasswordForm = this.fb.group({
      password: [null, [Validators.required, passwordFormatValidator]],
      confirmPassword: [null, Validators.required],
    },
      { validator: passwordFieldsMatchValidator });

    this.observablesSubscriptions.push(
      this.setPasswordForm.get('password').valueChanges.subscribe(() => {
        this.errors = [];
        this.hasChanges = true;
      }),
      this.setPasswordForm.get('confirmPassword').valueChanges.subscribe(() => {
        this.errors = [];
        this.hasChanges = true;
      })
    );
  }

  ngAfterViewInit() {
    $('input.code-input').on('keyup', function(event) {
      {
        const key = event.key;
        const inputs = $('input.code-input');

        if (($(this).val()['length'] === 1) && event.key !== undefined) {
          inputs.eq(inputs.index(this) + 1).trigger('focus');
        }

        if (key === 'Backspace' || key === 'Delete') {
          const indexNum = inputs.index(this);
          if (indexNum !== 0) {
            inputs.eq(inputs.index(this) - 1).val('').trigger('focus');
          }
        }
      }
    });
    this.loaderService.stop('confirmAccountContent');
  }

  validateForm() {
    if (this.setPasswordForm.valid) {
      this.setPassword();
    } else {
      this.formsService.showErrors(this.setPasswordForm);
      if (this.setPasswordForm.errors.passwordFieldsMatch) {
        this.errors = [('auth.messages.errors.password_mismatch')];
      }
    }
  }

  setPassword() {
    this.loaderService.start('confirmAccountContent');
    this.observablesSubscriptions.push(
      this.changePassword().subscribe(
        () => {
          this.confirmAccountService
            .confirmAccount(this.token).subscribe(
              () => {
                this.signInService.signIn({ authId: this.userEmail, password: this.setPasswordForm.value.password, sessionType: "WebClient" }).subscribe(
                  (response) => {
                    this.loaderService.stop('confirmAccountContent');
                    localStorage.setItem('token', response['data'].token);
                    this.router.navigateByUrl('/');
                  },
                  () => {
                    this.setPasswordForm.reset();
                    this.loaderService.stop('confirmAccountContent');
                    this.errors = [this.t.instant('auth.messages.errors.something_went_wrong')];
                  },
                );
              },
              () => {
                this.setPasswordForm.reset();
                this.loaderService.stop('confirmAccountContent');
                this.errors = [this.t.instant('auth.messages.errors.confirming_account')];
              },
            );
        },
        () => {
          this.setPasswordForm.reset();
          this.loaderService.stop('confirmAccountContent');
          this.errors = [this.t.instant('auth.messages.errors.something_went_wrong')];
        }
      )
    );
  }

  validateCode() {
    let code = '';
    this.confirmationCode.forEach(cod => {
      if (cod) {
        code += cod;
      }
    });
    if (code.length === 6) {
      this.loaderService.start('confirmAccountContent');
      this.observablesSubscriptions.push(
        this.validateConfirmationCode(code.toUpperCase(), this.token).subscribe(
          (response) => {
            if (this.errors.length > 0) {
              this.errors = [];
            }
            this.currentView = 'setPassword';
            this.userEmail = response['data'].userEmail;
            this.signUpLayout.refreshView('setPassword');
            this.loaderService.stop('confirmAccountContent');
          },
          () => {
            this.resetConfirmationCode();
            this.errors = [this.t.instant('messages.errors.invalid_confirmation_code')];
            this.loaderService.stop('confirmAccountContent');
          }
        )
      );
    }
  }

  resendEmail() {
    this.loaderService.start('confirmAccountContent');
    const email = this.parseJwt(this.token).authId;
    this.observablesSubscriptions.push(
      this.resendConfirmationEmail(email).subscribe(
        () => {
          this.errors = [];
          this.resetConfirmationCode();
          this.loaderService.stop('confirmAccountContent');
        },
        () => {
          this.loaderService.stop('confirmAccountContent');
          this.errors = [this.t.instant('messages.errors.something_went_wrong')];
        }
      )
    );
  }

  resetConfirmationCode() {
    this.confirmationCode = ['', '', '', '', '', ''];
    const inputs = $('input.code-input');
    inputs[0].focus();
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

  changeInputValue(event, index) {
    this.confirmationCode[index] = event.target.value;
    this.validateCode();
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    );
  }
}
