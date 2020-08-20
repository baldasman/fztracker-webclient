export class FormEngineModel {
  component: 'FormBuilderComponent';
  steps: FormEngineStepModel[];
  parameters: ParameterModel[];
  defaultData?: DefaultDataModel;

  constructor(component: FormEngineModel['component'], steps: FormEngineStepModel[], parameters: ParameterModel[], defaultData?: DefaultDataModel) {
    this.component = component;
    this.steps = steps || [];
    this.parameters = parameters || [];
    this.defaultData = this.defaultData || {};
  }
}

export class FormEngineStepModel {
  key: string;
  label: string;
  description: string;
  isActive: boolean;
}

export class ParameterModel {
  key: string;
  dataType: 'string' | 'boolean' | 'number' | 'password' | 'hexadecimal' | 'code' | 'coordinates' | 'separator' | 'static-list' | 'dynamic-list' | 'tree-list' | 'dual-list' | 'file' | 'fields-group';
  label: string;
  hint?: string;
  placeholder?: string;
  isVisible?: boolean;
  isEditable?: boolean;
  rank?: number;
  validations?: {
    isRequired?: boolean,
    // isEmail?: boolean, // In use???
    regexPattern?: string,
    min?: string | number,
    max?: string | number,
    minLength?: string | number,
    maxLength?: string | number
  };
  visibilityConditions?: {
    parameter: string,
    values: string[]
  };

  values?: (DatasetModel | string)[];       // used in "static-list" dataType
  datasource?: string;                      // used in "dynamic-list | tree-node" dataType
  // remoteDatasource?: {                      // used in "dynamic-list | tree-node" dataType
  //   method: string;
  //   endpoint: string;
  //   queryParams: { [key: string]: string };
  // };
  multipleSelections?: boolean;             // used in "static-list" / "dynamic-list" dataType
  allowedExtensions?: string[];             // used in "file" dataType
  fields?: ParameterModel[];                // used in "fields-group" dataType

  constructor(data: ParameterModel) {
    this.key = data.key;
    this.dataType = data.dataType;
    this.label = data.label;
    this.hint = data.hint || null;
    this.placeholder = data.placeholder || null;
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
    this.isEditable = data.isEditable !== undefined ? data.isEditable : true;
    this.rank = data.rank || 0;

    this.validations = data.validations || {};
    // if (data.validations?.isRequired) { this.validations.isRequired !== undefined ? data.validations.isRequired : true; }
    // if (data.validations?.regexPattern) { this.validations.regexPattern = data.validations.regexPattern; }
    // if (data.validations?.min) { this.validations.min = data.validations.min; }
    // if (data.validations?.max) { this.validations.max = data.validations.max; }

    this.visibilityConditions = data.visibilityConditions || null;

    this.values = data.values?.map(item => {
      if (item as { id: string, value: string }) {
        item = item as { id: string, value: string };
        return { id: item.id, value: item.value };
      }
      if (item as string) {
        item = item as string;
        return { id: item, value: item };
      }
    });

    this.datasource = data.datasource || null;
    // this.remoteDatasource = data.remoteDatasource || null;
    this.multipleSelections = data.multipleSelections || null;
    this.allowedExtensions = data.allowedExtensions;

    if (data.fields) {
      this.fields = (data.fields || []).map(f => new ParameterModel(f));
    }
  }

}


export class DefaultDataModel {
  [key: string]: ParameterValueModel | ParameterValueModel[] | ParameterValueDetailedModel | ParameterValueDetailedModel[]
}


export class ParameterValueModel {
  dataType: 'string' | 'boolean' | 'object' | 'array';
  value: string | number | boolean | object | ParameterValueModel[];

  constructor(dataType: string, value: any) {

    switch (dataType) {
      case 'password':
      case 'hexadecimal':
      case 'static-list':   // TODO: When multipleChoices exists, this may need review.
      case 'dynamic-list':  // TODO: When multipleChoices exists, this may need review.
      case 'tree-list':
        this.dataType = 'string';
        this.value = value;
        break;
      case 'boolean':
        this.dataType = dataType;
        this.value = (value === true || value === 'true');
        break;
      case 'file':
        this.dataType = 'object';
        this.value = value;
        break;
      case 'fields-group':
        this.dataType = 'array';
        this.value = value.map((v: any) => ({ dataType: 'object', value: v }));
        break;
      // case 'integer': // Commented on purpose! To be evaluated if integer type makes sense.
      //   this.dataType = 'numeric';
      //   break;
      default:
        this.dataType = 'string';
        this.value = value;
        break;
    }

  }

}

export class ParameterValueDetailedModel extends ParameterValueModel {

  isVisible: boolean;
  rank: number;
  label?: string;
  columns?: string[];

  constructor(dataType: string, value: any, isVisible: boolean, rank: number, label?: string, columns?: string[]) {
    super(dataType, value);
    this.isVisible = isVisible;
    this.rank = rank;
    this.label = label || null;
    this.columns = columns || null; // used when a parameter is off type array and is needed to show its info in a table
  }

}

export class DatasetModel {
  id: string;
  value: string;
  group?: string;
}

export class TreeDatasetModel {
  id: string;
  name: string;
  children?: TreeDatasetModel[];

  constructor(node: TreeDatasetModel) {
    this.id = node.id;
    this.name = node.name;
    this.children = node.children || [];
  }
}
