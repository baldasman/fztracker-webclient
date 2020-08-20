import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'catalog-forms-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() label: string;
  @Input() hint: string;

  public value: number;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() { }

  changeValue(value: number) {
    this.value = value;
  }

  ngOnDestroy() { }

}
