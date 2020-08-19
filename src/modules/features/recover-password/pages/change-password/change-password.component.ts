import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { FormsService, passwordFormatValidator, passwordFieldsMatchValidator } from '@shared/catalog/forms';
import { LoaderService } from '@shared/catalog/loader';
import { RecoverPasswordService } from '@features/recover-password/services/recover-password.service';

@Component({
  selector: 'app-page-change-password',
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
  public changePasswordForm: FormGroup;
  private observablesSubscriptions: Subscription[] = [];
  private token: string;

  public errors = [];

  public successMessage = {
    message: '',
    visible: false,
  };

  public contentReady = false;

  get f() { return this.changePasswordForm.controls; }

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private formsService: FormsService,
    private loaderService: LoaderService,
    private recoverPasswordService: RecoverPasswordService,
    private router: Router,
    private t: TranslateService
  ) {
  }

  ngOnInit() {
    this.loaderService.start('signInContent');
    this.token = this.activeRoute.snapshot.params.token;
    this.draw();
  }

  draw() {
    this.changePasswordForm = this.fb.group({
      password: [null, [Validators.required, passwordFormatValidator]],
      confirmPassword: [null, Validators.required],
    },
      { validator: passwordFieldsMatchValidator }
    );

    this.observablesSubscriptions.push(
      this.changePasswordForm.get('password').valueChanges.subscribe(() => {
        this.errors = [];
      }),
      this.changePasswordForm.get('confirmPassword').valueChanges.subscribe(() => {
        this.errors = [];
      })
    );

    this.contentReady = true;
    this.loaderService.stop('signInContent');
  }

  onPasswordChanged() {
    this.loaderService.stop('signInContent');
    this.successMessage.message
      = this.t.instant('auth.labels.success_changing_password_with_redirect');
    this.successMessage.visible = true;
    setTimeout(() => {
      this.router.navigate(['/signin']);
    }, 5000);
  }

  validateForm() {
    if (this.changePasswordForm.valid) {
      this.saveForm();
    } else {
      this.formsService.showErrors(this.changePasswordForm);
      if (this.changePasswordForm.errors.passwordFieldsMatch) {
        this.errors.push('auth.messages.errors.password_mismatch');
      }
    }
  }

  saveForm() {
    this.loaderService.start('signInContent');
    this.observablesSubscriptions.push(
      this.recoverPasswordService.changePassword({ ...this.changePasswordForm.value, token: this.token })
        .subscribe(
          () => {
            this.onPasswordChanged();
          },
          (errorResponse) => {
            this.errors = (errorResponse.error.data.errors || []).map(error => Object.values(error)[0]);
            this.loaderService.stop('signInContent');
          }
        )
    );
  }

  backToLogin() {
    this.router.navigate(['/signin']);
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    );
  }
}
