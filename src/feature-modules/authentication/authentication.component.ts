import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-authentication-component',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent implements OnInit, OnDestroy {

  imageLogo: string;

  constructor() { }

  ngOnInit() {
    this.imageLogo = 'assets/images/logos/default-logo.png';
  }

  ngOnDestroy() { }
}
