import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FormsService } from '@shared/catalog/forms';
import { LoaderService } from '@shared/catalog/loader';
import { RecoverPasswordService } from './services/recover-password.service';

@Component({
  selector: 'app-page-recover-password',
  templateUrl: './recover-password.component.html'
})

export class RecoverPasswordComponent implements AfterViewInit, OnDestroy, OnInit {
  private observablesSubscriptions: Subscription[] = [];
  public recoverForm: FormGroup;
  public errorMessage = false;
  public successMessage = false;

  get f() { return this.recoverForm.controls; }

  constructor(
    private fb: FormBuilder,
    private formsService: FormsService,
    private loaderService: LoaderService,
    private recoverPasswordService: RecoverPasswordService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loaderService.start('signInContent');
    this.recoverForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
    this.loaderService.stop('signInContent');
  }

  onPasswordRecovered() {
    this.successMessage = true;
    this.loaderService.stop('signInContent');
  }

  onErrorRecoveringPassword() {
    this.errorMessage = true;
    this.loaderService.stop('signInContent');
  }

  forgotPassword() {
    if (this.recoverForm.valid) {
      this.loaderService.start('signInContent');
      this.observablesSubscriptions.push(
        this.recoverPasswordService.recoverPassword(this.recoverForm.value).subscribe(
          () => {
            this.onPasswordRecovered();
          },
          () => {
            this.onErrorRecoveringPassword();
          }
        )
      );
    } else {
      this.formsService.showErrors(this.recoverForm);
    }
  }

  backToSignIn() {
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
