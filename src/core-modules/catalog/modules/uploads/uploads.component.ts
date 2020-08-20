import { Component, Input, Output, OnInit, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { upperFirst } from 'lodash';

import { UploadConfigurationModel, UploadEventModel } from './uploads.models';
import { UploadsEvents } from './uploads-events.enum';

const generateRandom = () => `${+new Date()}${Math.floor((Math.random() * 1000) + 1)}`;

@Component({
  selector: 'catalog-uploads',
  templateUrl: 'uploads.component.html',
  styleUrls: ['./uploads.component.scss'],
  encapsulation: ViewEncapsulation.None // WARNING: Styles applied here are global!
})

export class UploadsComponent implements OnInit {
  @Input() config: UploadConfigurationModel;
  @Output() addedFile = new EventEmitter<UploadEventModel>();
  @Output() removedFile = new EventEmitter<UploadEventModel>();
  @Output() uploadSuccess = new EventEmitter<UploadEventModel>();
  @Output() uploadError = new EventEmitter<UploadEventModel>();

  // @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;

  dzConfig: DropzoneConfigInterface;
  previewContainer = `preview-container-${generateRandom()}`;

  constructor(
    private readonly t: TranslateService
  ) { }

  ngOnInit() {

    const actionsHtmlArray = this.config.uploadedFilesActions.map(action =>
      `<a href="javascript:;" id="${action.id}" class="mr-2" title="${action.title}"><i class="${action.icon}"></i></a>`
    );

    this.dzConfig = {
      dictDefaultMessage: this.config.defaultMessage || this.t.instant('shared.uploads.placeholder_message'),
      dictRemoveFileConfirmation: this.config.removeFileConfirmationMessage || this.t.instant('shared.uploads.are_you_sure_delete_file'),
      url: this.config.url,
      headers: this.config.headers || (localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
      maxFilesize: this.config.maxFileSize,
      acceptedFiles: this.config.acceptedFiles,
      params: this.config.params,
      maxFiles: this.config.maxFiles,
    };

    setTimeout(() => {  // Await for component due initialization (controller + view).
      this.dzConfig.previewsContainer = `#${this.previewContainer}`;
      this.dzConfig.previewTemplate = `
      <div id="preview-template" class="dz-preview">
        <div class="dropzone-info">
          <div class="thumb-container">
            <img data-dz-thumbnail />
          </div>
          <div class="details h-100">
            <div class="d-flex">
              <div class="dz-success-mark"><span><i class="fa fa-check text-success"></i></span></div>
              <div class="dz-error-mark pl-2"><span><i class="fa fa-times text-danger"></i></span></div>
              <span data-dz-name class="pl-2"></span> <span class="pl-2" data-dz-size></span>
            </div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <div class="actions h-100">
              ${actionsHtmlArray.join('')}
              <a href="javascript:;" title="${upperFirst(this.t.instant('dictionary.remove'))}" data-dz-remove><i class="fa fa-trash"></i></a>
            </div>
          </div>
        </div>
      </div>`;
    });

  }


  onFileAdded(file) {
    if (file.type.search('image/') === -1) {
      file.previewElement.classList.add(`type-loading`);
    }

    this.addedFile.emit({ type: UploadsEvents.FILE_ADDED, response: file });
  }

  onFileRemoved(file) {
    this.removedFile.emit({ type: UploadsEvents.FILE_REMOVED, response: file });
  }


  onUploadProgress(event: [any, number, number]) { // [File information, Progress (%), Progress (size)]
    console.log('UploadProgress', event);
  }

  onUploadSuccess(event: [any, any, any]) { // [File information, XHR Response, ProgressEvent]

    const file = event[0];
    const response = event[1];

    this.addFileIconClass(file);

    this.config.uploadedFilesActions.forEach(action => {
      const e = file.previewElement.querySelector(`#${action.id}`);
      e.addEventListener('click', () => action.cb(file));
    });

    this.uploadSuccess.emit({ type: UploadsEvents.FILE_UPLOAD_SUCCESS, response });
  }

  onUploadError(event: [any, any, any]) {
    const file = event[0];
    const response = event[1];
    file.previewElement.classList.remove(`type-loading`);
    file.previewElement.classList.add(`type-error`);
    file.previewElement.querySelector('.dz-error-message').textContent = response.resultMessage || response;

    this.uploadError.emit({ type: UploadsEvents.FILE_UPLOAD_ERROR, response });
  }

  addFileIconClass(file) {
    file.previewElement.classList.remove(`type-loading`);
    const fileSplit = file.name.split('.');
    let fileExt = fileSplit[fileSplit.length - 1];
    if (this.config.acceptedFiles.search(fileExt) === -1) {
      fileExt = 'none';
    }
    file.previewElement.classList.add(`type-${fileExt}`);
  }

  // getAllFiles() {
  //   if (this.directiveRef.dropzone()) {
  //     return this.directiveRef.dropzone().files;
  //   }
  //   return [];
  // }

  // getFile(fileKey) {
  //   let file;
  //   if (this.directiveRef.dropzone()) {
  //     file = this.directiveRef.dropzone().files.find(f => f.fileKey === fileKey);
  //   }
  //   return file;
  // }

  // deleteFile(fileKey) {
  //   const files = this.directiveRef.dropzone().files;
  //   if (this.directiveRef.dropzone()) {
  //     const fileIndex = files.findIndex(f => f.fileKey === fileKey);

  //     if (fileIndex > -1) {
  //       files[fileIndex].previewElement.remove();
  //       files.splice(fileIndex, 1);
  //     }
  //   }
  // }

}
