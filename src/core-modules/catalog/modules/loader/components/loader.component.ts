import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'catalog-loader',
  templateUrl: './loader.component.html'
})

export class LoaderComponent implements OnInit {

  @Input() name: string;
  @Input() type?: string;
  @Input() size?: string;
  @Input() fullScreen?: boolean;
  @Input() color: string;
  @Input() bgColor: string;

  constructor() {}

  ngOnInit() {
    this.type = this.type || 'ball-scale-ripple-multiple';
    this.size = this.size || 'medium';
    this.fullScreen = !!this.fullScreen;
    this.color = this.color || '#5d78ff';
    this.bgColor = this.bgColor || 'rgba(0, 0, 0, 0.1)';
    // ="rgba(226,226,226,0.8)" -->
  }

}
