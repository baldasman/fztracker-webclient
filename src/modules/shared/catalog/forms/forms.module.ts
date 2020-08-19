import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { InputComponent } from './components/input/input.component';
import { RadioComponent } from './components/radio/radio.component';
import { SelectComponent } from './components/select/select.component';
import { TextAreaComponent } from './components/textarea/textarea.component';
import { SearchInputComponent } from './components/search-input/search-input.component';

import { FormsService } from './services/forms.service';

@NgModule({
  declarations: [
    CheckboxComponent,
    InputComponent,
    SelectComponent,
    RadioComponent,
    TextAreaComponent,
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    AngularFormsModule,
    TranslateModule,

    NgSelectModule
  ],
  exports: [
    CheckboxComponent,
    InputComponent,
    RadioComponent,
    SelectComponent,
    TextAreaComponent,
    SearchInputComponent
  ],
  providers: [
    FormsService
  ]
})

export class FormsModule {}
