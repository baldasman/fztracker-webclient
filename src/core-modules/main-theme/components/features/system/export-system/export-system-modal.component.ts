import { Component, OnInit, Inject } from '@angular/core';
import { upperFirst, cloneDeep } from 'lodash';
import { take } from 'rxjs/operators';

import { Mixin, Core, Stores, Forms, FormGroup, Animations } from '@app/base';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemsService } from '@core-modules/main-theme/services/systems.service';

@Component({
  selector: 'app-main-theme-features-export-system-modal',
  templateUrl: './export-system-modal.component.html'
})
export class ExportSystemModalComponent extends Mixin(Core, Stores, Forms, Animations) implements OnInit {
  public datasets: {
    formats: { id: string, value: string }[]
  };
  public form: FormGroup;

  get f() { return this.form.controls; }
  constructor(
    private readonly systemsService: SystemsService,
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<ExportSystemModalComponent>
  ) {
    super();
  }

  ngOnInit() {
    this.datasets = {
      formats: [
        { id: 'webtool', value: this.translate('app.title') },
        { id: 'desktop', value: upperFirst(this.translate('dictionary.desktop')) }
      ]
    };

    this.form = this.formBuilder.group({
      format: 'webtool'
    });
  }

  downloadFile(data, name, type) {
    const blob = new Blob([data], { type });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  exportSystem() {
    const system = cloneDeep(this.store.system.getSystemFullStateInfo());
    delete system.selectedGateway;

    this.systemsService.exportSystem(system).subscribe(
      res => {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition?.split(';')[1]?.split('filename=')[1]?.replace(new RegExp('"', 'g'), '')?.trim() || `${this.store.system.getSystem().name}.iwfx`;
        this.downloadFile(res.body, filename, res.headers.get('content-type'));
        this.dialogRef.close(true);
      },
      () => this.notification.error('Error exporting system.')
    );
  }

  exportSystemDesktopTool() {
    const system = cloneDeep(this.store.system.getSystemFullStateInfo());
    delete system.selectedGateway;
    this.systemsService.exportSystemDesktopTool(system).pipe(take(1)).subscribe(
      res => {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition?.split(';')[1]?.split('filename=')[1]?.replace(new RegExp('"', 'g'), '')?.trim() || `${this.store.system.getSystem().name}.isfx`;
        this.downloadFile(res.body, filename, res.headers.get('content-type'));
        this.dialogRef.close(true);
      },
      () => this.notification.error('Error exporting system.')
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    if (this.form.get('format').value === 'webtool') {
      this.exportSystem();
    } else {
      this.exportSystemDesktopTool();
    }
  }


}
