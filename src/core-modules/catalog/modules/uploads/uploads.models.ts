import { UploadsEvents } from './uploads-events.enum';

export class UploadConfigurationModel {

  url: string;
  acceptedFiles?: string;
  uploadedFilesActions?: UploadedFileActionModel[];
  defaultMessage?: string;
  removeFileConfirmationMessage?: string;
  maxFileSize?: number;
  maxFiles?: number;
  headers?: object;
  params?: object;
  style?: {
    heightLevel: 1 | 2 | 3 | 4;
  };

  constructor(data: UploadConfigurationModel) {
    this.url = data.url;
    this.acceptedFiles = data.acceptedFiles || '';
    this.uploadedFilesActions = data.uploadedFilesActions || [];
    this.defaultMessage = data.defaultMessage || '';
    this.removeFileConfirmationMessage = data.removeFileConfirmationMessage || '';
    this.maxFileSize = data.maxFileSize || 2; // in MB!
    this.maxFiles = data.maxFiles || null;
    this.headers = data.headers || null;
    this.params = data.params || null;
    this.style = {
      heightLevel: data.style?.heightLevel || 1
    };
  }
}

class UploadedFileActionModel {
  id: string;
  title: string;
  icon: string;
  cb: (item) => void; // Callback for the action to call when clicked.
}


export class UploadEventModel<T = {}> {
  type: UploadsEvents;
  response: T;
}

