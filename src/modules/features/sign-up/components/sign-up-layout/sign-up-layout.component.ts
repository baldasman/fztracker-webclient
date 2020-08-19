import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '@core/services/environment.service';
import { FilesService } from '@core/services/files.service';

@Component({
  selector: 'app-sign-up-layout',
  templateUrl: './sign-up-layout.component.html',
  styleUrls: ['./sign-up-layout.component.scss']
})

export class SignUpLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() view: string;

  public showRegistrationTitles: boolean;
  public showSetPasswordTitles: boolean;
  public showConfirmPasswordTitles: boolean;
  public logo = 'assets/images/auth-logo.png';

  constructor(
    private environmentService: EnvironmentService,
    private filesService: FilesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.refreshView();
  }

  ngAfterViewInit() { }

  refreshView(currentView?) {
    if (currentView) {
      this.view = currentView;
    }

    this.showRegistrationTitles = (this.route.snapshot.routeConfig.path === '');
    this.showSetPasswordTitles = (this.route.snapshot.routeConfig.path === 'confirm/:token');
    this.showSetPasswordTitles = false;
    this.showConfirmPasswordTitles = false;
    if (this.route.snapshot.routeConfig.path === 'confirm/:token' && this.view === 'setPassword') {
      this.showSetPasswordTitles = true;
    }
    if (this.route.snapshot.routeConfig.path === 'confirm/:token' && this.view === 'confirmAccount') {
      this.showConfirmPasswordTitles = true;
    }
  }

  ngOnDestroy() { }
}
