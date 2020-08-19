import {Injectable} from '@angular/core';
import {ActivatedRoute, CanActivate} from '@angular/router';
import {ContextService} from '@core/services/context.service';
import {EnvironmentService} from '@core/services/environment.service';

@Injectable()
export class ConfigurationsListGuard implements CanActivate {
  constructor(
      private contextService: ContextService,
      private environmentService: EnvironmentService,
      private route: ActivatedRoute) {}

  canActivate() {
    let referrer;

    if (document.referrer) {
      const ref = document.referrer.split('/');
      if (ref[2] && !ref[2].startsWith('accounts')) {
        referrer = ref[2];
      }
    } else if (this.route.snapshot.queryParams.referrer) {
      referrer = this.route.snapshot.queryParams.referrer;
    }

    this.contextService.setReferrer(referrer);

    const configs = {
      domain: {
        type: 'string',
        vale: JSON.stringify({url: 'localhost:4200', protocol: 'http'})
      },
      userRegisterMethod: {type: 'string', vale: 'enabled'}
    };

    this.environmentService.setConfigurations(configs);

    return true;
  }
}
