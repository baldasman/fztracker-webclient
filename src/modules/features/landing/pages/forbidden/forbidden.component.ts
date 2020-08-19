import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../../../core/services/users.service';


@Component({
  selector: 'app-page-forbidden',
  templateUrl: './forbidden.component.html'
})

export class ForbiddenComponent implements OnInit, OnDestroy {
  private observablesSubscriptions: Subscription[] = [];

  constructor() {
    
  }

  ngOnInit() {
    
  }

  
  ngOnDestroy() {
    this.observablesSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
