import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../../../core/services/users.service';


@Component({
  selector: 'app-page-main',
  templateUrl: './main.component.html'
})

export class MainComponent implements OnInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  public contentReady = false;
  public name : string;

  constructor(private t: TranslateService, private userService: UsersService) {
    
  }

  ngOnInit() {
    this.userService.getSession().subscribe(
      (response: {data: {user: {name: string}}}) => {
        if (response.data.user) {
          this.name = response.data.user.name;
        }

        this.draw();
      },
      (error) => {
        console.error(error);
      });
  }

  draw() {
    this.contentReady = true;
  }

  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
