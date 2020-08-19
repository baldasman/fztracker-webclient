import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { EnvironmentService } from '@core/services/environment.service';
import { FormsService } from '@shared/catalog/forms';
import { LoaderService } from '@shared/catalog/loader';
import { SignUpService } from '@sign-up/services/sign-up.service';

@Component({
  selector: 'app-page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements AfterViewInit, OnDestroy, OnInit {
  public signUpForm: FormGroup;
  private observablesSubscriptions: Subscription[] = [];
  public termsUrl: string;
  public privacyUrl: string;
  public successMessage = {
    visible: false,
    text: '',
  };

  private captcha = '';
  public contentReady = false;

  public errors = [];

  public datasets = {
    countries: [],
    companyTypes: []
  };

  get f() { return this.signUpForm.controls; }

  constructor(
    private environmentService: EnvironmentService,
    private fb: FormBuilder,
    private formsService: FormsService,
    private loaderService: LoaderService,
    private router: Router,
    private signUpService: SignUpService,
    private t: TranslateService
  ) {
    // this.termsUrl = this.environmentService.getConfiguration('appTermsConditions');
    // this.privacyUrl = this.environmentService.getConfiguration('appPrivacyPolicy');
  }

  getCountriesList() {
    return this.signUpService.getCountriesList();
  }
  onCountriesListLoaded(response) {
    this.datasets.countries = response.data.countries;
  }

  getCompanyTypes() {
    return this.signUpService.getCompanyTypesList();
  }
  onCompanyTypesLoaded(response) {
    this.datasets.companyTypes = response.data.company_types;
  }

  ngOnInit() {
    this.loaderService.start('signUpContent');

    this.observablesSubscriptions.push(
      forkJoin(
        [this.getCountriesList(),
        this.getCompanyTypes()]
      ).subscribe(
        result => {
          this.onCountriesListLoaded(result[0]);
          this.onCompanyTypesLoaded(result[1]);
          this.draw();
        },
        () => {
          this.loaderService.stop('signUpContent');
        }
      ),
    );
  }

  ngAfterViewInit() { }

  draw() {
    this.signUpForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      country: [null, Validators.required],
      phoneCode: ['\+351', [Validators.required, Validators.pattern(/^(\+\d{1,4})$/)]],
      phone: [null, Validators.required],
      companyTypeId: [null, [Validators.required]],
      terms: [null, Validators.requiredTrue],
      allowEmailMarketing: [false]
    });

    this.observablesSubscriptions.push(
      this.signUpForm.get('name').valueChanges.subscribe((result) => {
        if (result && result !== result.trim()) {
          this.signUpForm.get('name').setValue(result.trim());
        }
      }),
      this.signUpForm.get('country').valueChanges.subscribe((result) => {
        const selectedCountry = this.datasets.countries.find(country => country.countryId === result);
        const phoneCode = (selectedCountry || {}).phoneCode || 351;
        this.signUpForm.get('phoneCode').setValue(`\+${phoneCode}`);
      })
    );
    this.contentReady = true;
    this.loaderService.stop('signUpContent');

  }

  resolved(event) {
    this.captcha = event;
  }

  signUp() {
    if (this.signUpForm.valid) {
      if (this.captcha) {
        this.loaderService.start('signUpContent');
        const phoneCode = this.signUpForm.value.phoneCode.substring(1);

        const body = this.signUpForm.value;
        body.phoneCode = phoneCode;

        this.observablesSubscriptions.push(
          this.signUpService.signUp(body).subscribe(
            () => {
              const configurations = this.environmentService.getConfigurations() || {};
              if (configurations['userRegisterMethod'].value === 'enabled') {
                this.successMessage = { visible: true, text: this.t.instant('auth.messages.success.register_success') };
              } else {
                this.successMessage = { visible: true, text: this.t.instant('auth.messages.success.pending_register_success') };
              }
              this.contentReady = true;
              this.loaderService.stop('signUpContent');
            },
            (errorResponse) => {
              errorResponse.error.data.errors.map(error => {
                if (Object.keys(error)[0] === 'base') {
                  this.errors.push(error);
                } else {
                  this.signUpForm.get(Object.keys(error)[0]).setErrors({ custom: Object.values(error)[0] });
                }
              });
              this.loaderService.stop('signUpContent');
            }
          )
        );
      }
    } else {
      this.formsService.showErrors(this.signUpForm);
    }
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
