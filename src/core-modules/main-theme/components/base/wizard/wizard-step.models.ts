export class WizardSummaryModel {
  currentStepIndex: number; // Keeps track of step currently visible.

  summary: {
    icon: string,
    title: string,
    description?: string
  }[];

  steps: {
    isCurrent: boolean,
    state: 'pending' | 'completed'
    completed: boolean,
    summaryStepIndex?: number
  }[];

  constructor(data: Partial<WizardSummaryModel>) {
    this.currentStepIndex = data.currentStepIndex || 0;
    this.summary = data.summary;
    this.steps = data.steps;
  }


  addStep(stepIndex: number, summaryIndex: number) {
    this.steps.splice(stepIndex, 0, { state: 'pending', isCurrent: false, completed: false, summaryStepIndex: summaryIndex });
  }

  getIcon() { return this.summary[this.steps[this.currentStepIndex].summaryStepIndex].icon; }
  getTitle() { return this.summary[this.steps[this.currentStepIndex].summaryStepIndex].title; }
  getDescription() { return this.summary[this.steps[this.currentStepIndex].summaryStepIndex].description; }

  getSummarySteps(summaryStepIndex: number) {
    return this.steps.filter(step => step.summaryStepIndex === summaryStepIndex).map(step => {
      return { ...step, ...(step.isCurrent ? { state: 'current' } : { state: step.state }) }; // When is current, return that state (without overriding it).
    });
  }

  getSummaryState(summaryStepIndex: number) {

    const stepStates = this.getSummarySteps(summaryStepIndex).map(summary => summary.state);

    if (stepStates.length === 0) { return 'pending'; }
    if (stepStates.includes('current')) { return 'current'; }
    if (stepStates.includes('pending')) { return 'pending'; }
    if (stepStates.includes('completed')) { return 'completed'; }

  }

  setCompleted() { this.steps[this.currentStepIndex].state = 'completed'; }

  previousStep() {
    this.steps[this.currentStepIndex].isCurrent = false;
    this.currentStepIndex--;
    this.steps[this.currentStepIndex].isCurrent = true;
  }

  nextStep() {
    this.steps[this.currentStepIndex].isCurrent = false;
    this.currentStepIndex++;
    this.steps[this.currentStepIndex].isCurrent = true;
  }

  gotoStep(index: number): void {
    this.steps[this.currentStepIndex].isCurrent = false;
    this.currentStepIndex = index;
    this.steps[this.currentStepIndex].isCurrent = true;
  }

}

export class WizardStepModel<T = any> {
  title: string;
  extraInfo?: {
    type: 'static' | 'dynamic',
    context?: string // Used for dynamic steps.
    openedOnSummary?: boolean
  };
  component: any;
  visible: boolean;
  editable: boolean;
  visited: boolean;
  completed: boolean;
  data: T;
  outputs: {
    cancelEvent?: (data?: object) => void,
    previousStepEvent?: (data?: object) => void,
    nextStepEvent?: (data?: object) => void,
    submitEvent?: (data?: object) => void
  };

  constructor(data: Partial<WizardStepModel>) {
    this.title = data.title || null;
    this.extraInfo = data.extraInfo;
    this.component = data.component;
    this.visible = data.visible !== undefined ? data.visible : true;
    this.editable = data.editable !== undefined ? data.editable : true;
    this.visited = data.visited !== undefined ? data.visited : false;
    this.completed = data.completed !== undefined ? data.completed : true;
    this.data = data.data;
    this.outputs = data.outputs;
  }

  setVisible() { this.visible = true; return this; }
  setInvisible() { this.visible = false; return this; }
  setVisited() { this.visited = true; return this; }

}
