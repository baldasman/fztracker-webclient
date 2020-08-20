import { Component, Input, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

import { WizardSummaryModel, WizardStepModel } from './wizard-step.models';

@Component({
  selector: 'main-theme-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: WizardComponent }]
})
export class WizardComponent extends CdkStepper implements OnInit, AfterViewInit {

  @Input() wizardSummary: WizardSummaryModel;

  ngOnInit() { }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  stepState(stepIndex: number) {

    const step = this.steps.toArray()[stepIndex];

    if (stepIndex === this.selectedIndex) { return 'current'; }
    if (step.completed) { return 'completed'; }
    if (step.interacted) { return 'warning'; }

    return 'pending';

  }

  isFirstStep(index?: number) {
    const selectedIndex = index !== undefined ? index : this.selectedIndex;
    return selectedIndex === this.steps.length - 1 ? true : false;
  }

  isLastStep(index: number) {
    const selectedIndex = index !== undefined ? index : this.selectedIndex;
    return selectedIndex === this.steps.length - 1 ? true : false;
  }

  nextStep(): void {
    if (this.selectedIndex < this.steps.length - 1) {
      this.selectedIndex++;
    }
  }

  previousStep(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  gotoStep(index: number): void {
    this.selectedIndex = index;
  }

  setComplete(b: boolean): void {
    this.selected.completed = b;
  }

}
