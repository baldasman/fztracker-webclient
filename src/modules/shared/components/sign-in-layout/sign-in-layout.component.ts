import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '@core/services/environment.service';
import { FilesService } from '@core/services/files.service';

@Component({
  selector: 'app-sign-in-layout',
  templateUrl: './sign-in-layout.component.html',
  styleUrls: ['./sign-in-layout.component.scss']
})

export class SignInLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  public title: string;
  public showLinks: boolean;
  public userRegisterMethod: string;
  public logo = 'assets/images/logo.png';

  constructor(
    private environmentService: EnvironmentService,
    private filesService: FilesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.route) {
      this.title = this.route.snapshot.data.title;
      this.showLinks = (this.route.snapshot.routeConfig.data.title === 'auth.labels.sign_in');
    }

    this.userRegisterMethod = this.environmentService.getConfiguration('userRegisterMethod');
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }
}
