import { Component, OnInit, OnChanges, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { FormsService } from '../../services/forms.service';
import { LoaderService } from '../../../loader';

import { FormEngineHelper } from './helpers/form-engine.helper';

import { ParameterModel, DefaultDataModel, DatasetModel, TreeDatasetModel } from './models/form-engine.models';
import { FormEngineEvents } from './enums/form-engine-events.enum';

/**
 * @param parameters is an array of ParameterModel. For more info, check ParameterModel.
 * @param values is an object of objects to set the values of the parameters. This object follows the structure { parameterKey: { dataType, value } }.
 *
 * parameters will be drawn according with their rank and if none is provided, it will be displayed last, by the order they are in the array
 *
 * getFormValues() returns the value of the form and its state (valid or not). This is triggered by the components that use form engine so that they
 * can have access to the values of the form.
 */
@Component({
  selector: 'catalog-forms-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EngineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() parameters: ParameterModel[];
  @Input() values: DefaultDataModel;
  @Output() formEngineEvents: EventEmitter<{
    type: string,
    data: {
      key: string,
      datasource?: string,
      // remoteDatasource?: { endpoint: string; method: string; queryParams: { [key: string]: string } },
      dataset?: (DatasetModel | TreeDatasetModel)[];
    }
  }> = new EventEmitter();

  private loggerContext = 'Catalog::FormsModule::EngineComponent::';
  private subscriptions: Subscription[] = [];

  private visibilityTriggerFields: { [key: string]: { parameter: ParameterModel, parameterControl: FormControl }[] } = {};

  public form: FormGroup;
  get f() { return this.form.controls; }

  public datasets: {
    [key: string]: (DatasetModel | TreeDatasetModel)[]
  };

  public contentReady = false;

  constructor(
    private logger: NGXLogger,
    private loaderService: LoaderService,
    private formsService: FormsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.values = this.values || {};
    this.datasets = {};

    this.buildForm();

    this.contentReady = true;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) { // When any of the input change (after component initialization), form gets updated!

    if (!changes.parameters?.isFirstChange() && !changes.values?.isFirstChange()) {
      // this.logger.debug(this.loggerContext + 'OnChanges: Parameters', this.parameters);
      // this.logger.debug(this.loggerContext + 'OnChanges: Values', this.values);
      this.buildForm();
    }

  }


  buildForm() {

    this.form = new FormGroup({}); // This will ensure that previous information is cleared!
    this.visibilityTriggerFields = {}; // Reset visibility rules and previous created subscriptions.
    this.subscriptions.forEach(s => s.unsubscribe());

    this.form = FormEngineHelper.buildForm(this.parameters, this.values);

    this.parameters.forEach(parameter => {

      // Send events to fetch for datasource's.
      if (parameter.dataType === 'dynamic-list' || parameter.dataType === 'tree-list') {
        if (parameter.datasource && !this.datasets[parameter.key]) {
          this.datasets[parameter.key] = [];
          this.loaderService.show(`parameter-${this.replaceSpaces(parameter.key)}`);
          this.formEngineEvents.emit({ type: FormEngineEvents.PARAMETER_DYNAMIC_LIST_DATASOURCE_REQUEST, data: { key: parameter.key, datasource: parameter.datasource } });
        }
      }

      // For each FormControl, fill visibilityTriggerFields with references needed.
      if (parameter.visibilityConditions) {
        const triggerFieldKey = parameter.visibilityConditions.parameter;
        if (!this.visibilityTriggerFields[triggerFieldKey]) { this.visibilityTriggerFields[triggerFieldKey] = []; }
        this.visibilityTriggerFields[triggerFieldKey].push({ parameter, parameterControl: this.form.get(parameter.key) as FormControl });
      }

    });

    // Create subscriptions for each field marked as "trigger field" and apply validators to the fields affected by this trigger field.
    Object.keys(this.visibilityTriggerFields).forEach(triggerFieldKey => {
      this.subscriptions.push(
        this.form.get(triggerFieldKey)?.valueChanges.subscribe(() => {

          this.visibilityTriggerFields[triggerFieldKey].forEach(formField => {
            if (!this.isParameterVisible(formField.parameter)) {
              formField.parameterControl.clearValidators();
              formField.parameterControl.updateValueAndValidity();
            }
            else {
              formField.parameterControl.setValidators(FormEngineHelper.getParameterValidators(formField.parameter));
              formField.parameterControl.updateValueAndValidity();
            }
          });

        })
      );
    });

    this.focusFirstElement();

    this.cdr.detectChanges();

  }

  isParameterVisible(parameter: ParameterModel): boolean {
    return FormEngineHelper.isParameterVisible(this.form, parameter);
  }

  getFieldsGroupVisibleFields(parameterFields: ParameterModel[]) {

    return parameterFields.filter(field => {
      return this.isParameterVisible(field);
    });

  }


  addFieldGroupRow(parameter: ParameterModel, value?: {}) {
    (this.form.get(parameter.key) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter, value));
  }

  removeFieldGroupRow(parameterKey: string, index: number) {
    (this.form.get(parameterKey) as FormArray).removeAt(index);
  }


  updateDynamicListDataset(key: string, value?: (DatasetModel | TreeDatasetModel)[]) {

    // this.logger.debug(this.loggerContext + 'updateDynamicListDataset', key, value);
    if (this.datasets[key]) {
      this.datasets[key] = value;
      this.loaderService.hide(`parameter-${key}`);
    }

  }

  updateTreeDataset(parameterKey: string, event: { type: string, data: TreeDatasetModel[] }) {
    this.formEngineEvents.emit({ type: FormEngineEvents.PARAMETER_DYNAMIC_LIST_DATASET_UPDATED, data: { key: parameterKey, dataset: event.data } });
  }

  updateSelectedTreeNode(parameterKey: string, event: { type: string, data: { id: string, name: string, path: string } }) {
    this.form.get(parameterKey).setValue(event?.data?.id);
  }

  // Group 'dynamic-list' datasets by group if it is defined.
  datasetGroupBy(parameterKey: string): string {
    return (this.datasets[parameterKey] as DatasetModel[])[0]?.group ? 'group' : null;
  }


  getFormValues(): { valid: boolean, data: DefaultDataModel } {

    if (!this.form.valid) {
      this.formsService.showErrors(this.form);
      this.cdr.detectChanges();
    }

    return FormEngineHelper.getFormValues(this.form, this.parameters);

  }


  replaceSpaces(s: string) {
    return s.replace(/\s/g, '-');
  }

  focusFirstElement() {
    // Try to focus on first field.
    const firstAutofocusableElement = this.parameters?.find(p => p.dataType === 'string' || p.dataType === 'number');
    if (firstAutofocusableElement) {
      setTimeout(() => { // Force waiting for DOM to be rendered.
        const el = document.querySelector(`#parameter-${this.replaceSpaces(firstAutofocusableElement.key)} > div > catalog-forms-input > div > input`) as HTMLElement;
        el?.focus();
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
