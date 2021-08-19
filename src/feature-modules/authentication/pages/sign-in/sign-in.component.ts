import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Mixin, Core, Animations, Forms, Stores } from '@app/base';

import { AuthenticationService } from '@auth-feature-module/services/authentication.service';

@Component({
  selector: 'app-authentication-page-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent extends Mixin(Core, Animations, Forms, Stores) implements OnInit {

  form: FormGroup;
  get f() { return this.form.controls; }


  constructor(
    private authenticationService: AuthenticationService,
  ) { super(); }


  ngOnInit() {

    this.form = this.formBuilder.group({
      authId: [null, Validators.required],
      authPassword: [null, Validators.required]
    });

  }


  onSubmit() {

    this.showPageLoader();

    this.f.authPassword.updateValueAndValidity(); // Reset to original state.

    if (!this.form.valid) {
      this.hidePageLoader();
      this.f.authPassword.setErrors({ custom: this.translate('features.authentication.messages.all_fields_filled') });
      this.formService.showErrors(this.form);
      return;
    }

    this.subscriptions.push(
      this.authenticationService.signIn(this.f.authId.value, this.f.authPassword.value).subscribe(
        result => {
        console.log('o resiltado', result);
          localStorage.setItem('token', result.token);
          localStorage.setItem('externalId', result.externalId);

          let redirectTo: string;
          if (localStorage.getItem('referrer')) {
            redirectTo = localStorage.getItem('referrer');
            localStorage.removeItem('referrer');
          } else if (result.isAdmin === true) {
            const serial = result.externalId || 'x';
            redirectTo = `/profile/${serial.substr(1)}`;

          } else {
            redirectTo = '/cfhome';

          }
          console.log('redirectTo', redirectTo);
          this.hidePageLoader();
          this.notification.success(this.translate('features.authentication.messages.login_success'));

          this.router.navigateByUrl(redirectTo);

        },
        () => {
          this.hidePageLoader();
          this.f.authPassword.setErrors({ custom: this.translate('features.authentication.messages.login_error') });
          this.formService.showErrors(this.form);
        })
    );

  }

}
