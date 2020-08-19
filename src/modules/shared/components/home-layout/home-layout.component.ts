import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EnvironmentService} from '@core/services/environment.service';
import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})

export class HomeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  public title: string;
  public showLinks: boolean;
  public userRegisterMethod: string;
  public logo = 'assets/images/auth-logo.png';
  public name : string;

  constructor(
      private environmentService: EnvironmentService,
      private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = "Home";

    this.name = localStorage.getItem('name');
  }

  ngAfterViewInit() {}

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  }

  ngOnDestroy() {}
}
