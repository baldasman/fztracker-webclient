import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppGenericCardComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { static: false }) header: ElementRef;
  @ViewChild('headerContent', { static: false }) headerContent: ElementRef;

  @Input() collapsed: any;
  @Input() fullHeight: boolean;
  @Output() buttonCardEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.headerContent.nativeElement.childNodes.length === 0) {
      this.header.nativeElement.style.display = 'none';
    }
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.buttonCardEvent.emit({ type: 'collapsed', value: this.collapsed });
  }
}
