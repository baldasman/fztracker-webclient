import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  forwardRef,
  ContentChild,
  TemplateRef,
  Directive,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { upperFirst, cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

import { TreeManagementModalComponent } from './components/tree-management-modal.component';

import { FormsService } from '../../services/forms.service';
import { FormEngineEvents } from '../engine/enums/form-engine-events.enum';
import { TreeDatasetModel } from '../engine/models/form-engine.models';
import { TreeHelper } from './helpers/tree.helper';

@Directive({ selector: '[appSelectOptionsTemplate]' })
export class OptionsTemplateDirective { }
@Directive({ selector: '[appSelectLabelTemplate]' })
export class LabelTemplateDirective { }

@Component({
  selector: 'catalog-forms-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TreeSelectComponent),
    multi: true
  }]
})

export class TreeSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ContentChild(OptionsTemplateDirective, { read: TemplateRef }) optionsTemplate: OptionsTemplateDirective;
  @ContentChild(LabelTemplateDirective, { read: TemplateRef }) labelTemplate: LabelTemplateDirective;

  @Input() formControlField: FormControl;

  @Input() id?: string;
  @Input() label: string;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() description: string;
  @Input() readonly: boolean;

  @Input() appendTo: string;
  @Input() icon: string;

  @Input() items: { id: string, children: [], name: string, path: string }[];

  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() clearable?: boolean;

  @Input() hideMessages: boolean;
  @Input() customView: boolean;
  @Input() action: { type: string, icon: string };

  @Input() managementTitle: string;

  @Output() updateDatasetValueEvent = new EventEmitter<{ type: string, data: TreeDatasetModel[] }>();
  @Output() updateSelectedOptionEvent = new EventEmitter<{ type: string, data: { id: string, children: [], name: string, path: string } }>();

  public selectedValue: string;
  public hasError: boolean;
  public errorMessage: string;
  public itemsToShow: { id: string, value: string, path: string }[];

  public itemsBuffer = [];
  public bufferSize = 50;
  public numberOfItemsFromEndBeforeFetchingMore = 10;

  private onChange: any = () => { };
  private onTouch: any = () => { };

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private formsService: FormsService
  ) {
    this.action = { type: 'button', icon: 'fa fa-wrench' };
  }

  ngOnInit() {
    this.id = this.id || uuid();
    this.bindLabel = this.bindLabel || 'value';
    this.bindValue = this.bindValue || 'id';
    this.clearable = !!this.clearable;
    this.hideMessages = this.hideMessages || false;
    this.label = upperFirst(this.label) || '';
    this.placeholder = this.placeholder || '';
    this.managementTitle = this.managementTitle || this.label || this.translateService.instant('shared.forms_module.tree_select.management_default_title');

    this.itemsBuffer = this.items?.slice(0, this.bufferSize);
    this.updateItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.hasError = (this.formControlField.invalid && (this.formControlField.touched || this.formControlField.dirty));
    this.errorMessage = this.hasError ? this.formsService.getValidationMessage(this.formControlField.errors) : '';
    if (changes.items) {
      this.updateItems();
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit() { }

  // Below methods are automatically called for each component implementing ControlValueAccessor interface.
  // Writes new values from the form model into the view.
  writeValue(value: any) {
    this.selectedValue = value;
    this.cdr.detectChanges();
  }

  // Used to register a handler that should be fired when something in the view change.
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // Similar to registerOnChange(), but this registers a handler specifically for when a control receives a touch event.
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onTouched() {
    this.onTouch(null);
  }

  onChanged(e: { id: string, value: string, path: string}) {
    let v: any = null;

    if (e) {
      v = e[this.bindValue];
    }

    this.onChange(v);
  }

  // lazy loading methods
  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.items.length <= this.itemsBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length) {
      this.fetchMore();
    }
  }

  updateItems() {
    this.itemsToShow = [];
    this.formatTree(this.items, this.itemsToShow);
    this.itemsToShow = cloneDeep(this.itemsToShow);
  }

  fetchMore() {
    const len = this.itemsBuffer.length;
    const more = this.items.slice(len, this.bufferSize + len);
    this.itemsBuffer = this.itemsBuffer.concat(more);
  }

  formatTree(nodes: { id: string, children: [], name: string, path: string }[], nodesToShow: { id: string, value: string, path: string }[]) {
    (nodes || []).forEach(n => {
      const nodeToShow: { id: string, value: string, path: string } = { id: n.id, value: n.name, path: n.path };
      nodesToShow.push(nodeToShow);
      this.formatTree(n.children, nodesToShow);
    });
  }

  onActionClicked() {
    const dialogRef = this.dialog.open(TreeManagementModalComponent, {
      panelClass: 'dialog-width-25', // TODO: This is a project class. To review!
      data: { values: this.items, label: this.managementTitle }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        if (result.tree) {
          this.updateDatasetValueEvent.emit({ type: FormEngineEvents.PARAMETER_DYNAMIC_LIST_DATASET_UPDATED, data: result.tree });

          // check if selected value is deleted
          const findNode = TreeHelper.findNodeOnTree(result.tree, this.selectedValue);
          if (!findNode) {
            this.selectedValue = null;
            this.updateSelectedOptionEvent.emit({ type: FormEngineEvents.PARAMETER_DYNAMIC_LIST_SELECTED_OPTION_UPDATED, data: null });
          }
        }
        if (result.selected) {
          this.selectedValue = result.selected.id;
          this.updateSelectedOptionEvent.emit({ type: FormEngineEvents.PARAMETER_DYNAMIC_LIST_SELECTED_OPTION_UPDATED, data: result.selected });
        }
      }
    });
  }

  ngOnDestroy() { }

}
