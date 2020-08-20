import { EventEmitter } from '@angular/core';

export interface WizardStepEvent<T = object> {
  isComplete: boolean;
  data: T;
}

export interface WizardStep {

  title: string;
  data: object;
  steps: { currentStep: number, totalSteps: number };

  cancelEvent: EventEmitter<WizardStepEvent>;
  previousStepEvent: EventEmitter<WizardStepEvent>;
  nextStepEvent: EventEmitter<WizardStepEvent>;
  submitEvent: EventEmitter<WizardStepEvent>;

  onCancel: () => void;
  onPreviousStep: () => void;
  onNextStep: (data?: any) => void;
  onSubmit: () => void;

}
