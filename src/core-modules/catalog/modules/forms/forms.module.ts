import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LAZY_MAPS_API_CONFIG, AgmCoreModule } from '@agm/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';

import { LoaderModule } from '../loader';
import { TreeModule } from '../tree';

import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CodeComponent } from './components/code/code.component';
import { DualListComponent } from './components/dual-list/dual-list.component';

import { CoordinatesComponent } from './components/coordinates/coordinates.component';
import { AppMapComponent } from './components/coordinates/map-picker/map/map.component';
import { MapPickerComponent } from './components/coordinates/map-picker/map-picker.component';

import { EngineComponent } from './components/engine/engine.component';
import { InputComponent } from './components/input/input.component';
import { RadioComponent } from './components/radio/radio.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SelectComponent, OptionsTemplateDirective, LabelTemplateDirective } from './components/select/select.component';
import { TextComponent } from './components/text/text.component';
import { TextAreaComponent } from './components/textarea/textarea.component';

import { DeleteNodeModalComponent } from './components/tree-select/components/delete-node-modal.component';
import { NewditNodeModalComponent } from './components/tree-select/components/newdit-node-modal.component';
import { TreeSelectComponent } from './components/tree-select/tree-select.component';
import { TreeManagementModalComponent } from './components/tree-select/components/tree-management-modal.component';

import { FormsService } from './services/forms.service';

import { AutofocusDirective } from './directives/autofocus-directive';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({}),
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    TranslateModule,

    MatCheckboxModule,
    MatDialogModule,
    NgSelectModule,

    LoaderModule,
    TreeModule
  ],
  declarations: [
    AppMapComponent,
    CheckboxComponent,
    CodeComponent,
    CoordinatesComponent,
    DeleteNodeModalComponent,
    DualListComponent,
    EngineComponent,
    InputComponent,
    NewditNodeModalComponent,
    MapPickerComponent,
    NewditNodeModalComponent,
    RadioComponent,
    SearchInputComponent,
    SelectComponent,
    TextComponent,
    TextAreaComponent,
    TreeSelectComponent,
    TreeManagementModalComponent,

    AutofocusDirective,
    LabelTemplateDirective,
    OptionsTemplateDirective
  ],

  exports: [
    AngularFormsModule,
    ReactiveFormsModule,
    AppMapComponent,
    CheckboxComponent,
    CoordinatesComponent,
    DeleteNodeModalComponent,
    DualListComponent,
    CodeComponent,
    EngineComponent,
    InputComponent,
    NewditNodeModalComponent,
    MapPickerComponent,
    RadioComponent,
    SearchInputComponent,
    SelectComponent,
    TextComponent,
    TextAreaComponent,
    TreeSelectComponent,
    TreeManagementModalComponent,

    AutofocusDirective,
    LabelTemplateDirective,
    OptionsTemplateDirective
  ],
  providers: [
    FormsService
  ]
})
export class FormsModule {
  static forRoot(config): ModuleWithProviders<FormsModule> {
    return {
      ngModule: FormsModule,
      providers: [
        {
          provide: LAZY_MAPS_API_CONFIG,
          useClass: config.googleMapsConfig
        }
      ]
    };
  }
}
