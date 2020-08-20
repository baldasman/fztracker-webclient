import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'catalog-forms-dual-list',
  templateUrl: './dual-list.component.html',
  styleUrls: ['./dual-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DualListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() values: Array<{ id: number, value: string }>;
  @Input() selectedValues?: Array<{ id: number, value: string }>;
  @Input() label: string;

  public filteredValues: Array<{ id: number, value: string }>;
  public optionSelected: { id: number, value: string };
  private search: string;

  constructor() {
    this.values = [];
    this.filteredValues = [];
    this.selectedValues = [];
    this.search = '';
  }

  ngOnInit() {
    this.filteredValues = this.values || [];
  }

  ngAfterViewInit() { }

  moveOption(source: Array<{ id: number, value: string }>, target: Array<{ id: number, value: string }>, optionId: number) {
    // find element index
    const elemIndex = source.findIndex(e => e.id === optionId);
    if (elemIndex !== -1) {
      // add to target
      target.push(source[elemIndex]);
      // delete from source
      source.splice(elemIndex, 1);
      // refresh filter
      this.filterOptions(this.search);
    }
  }

  toggleOption(option: { id: number, value: string }) {
    if (this.optionSelected && this.optionSelected.id === option.id) {
      this.optionSelected = undefined;
    } else {
      this.optionSelected = option;
    }
  }

  addOption() {
    if (this.optionSelected) {
      const elem = this.values.find(o => o.id === this.optionSelected.id);
      if (elem) {
        this.moveOption(this.values, this.selectedValues, elem.id);
      }
    }
  }

  removeOption() {
    if (this.optionSelected) {
      const elem = this.selectedValues.find(o => o.id === this.optionSelected.id);
      if (elem) {
        this.moveOption(this.selectedValues, this.values, elem.id);
      }
    }
  }

  addAllOptions() {
    this.selectedValues = this.selectedValues.concat(this.values);
    this.values = [];
    this.filteredValues = [];
  }

  removeAllOptions() {
    this.values = this.values.concat(this.selectedValues);
    this.selectedValues = [];
    this.filterOptions(this.search);
  }

  filterOptions(value: string) {
    // save search value
    this.search = value;
    if (value === '') {
      // when search is empty show all options
      this.filteredValues = this.values;
    } else {
      this.filteredValues = [];
      this.values.forEach(opt => {
        if (opt.value.includes(value)) {
          this.filteredValues.push(opt);
        }
      });
    }
  }

  ngOnDestroy() { }

}
