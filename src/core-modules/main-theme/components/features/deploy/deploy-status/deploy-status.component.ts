import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { take } from 'rxjs/operators';
import { upperFirst } from 'lodash';

import { Mixin, Core, Stores, Animations } from '@app/base';

import { DeploysService } from '../../../../../stores/services/deploys.service';

import { timeAgoInWords } from '../../../../../core/models/dates-helper.component';

@Component({
  selector: 'app-main-theme-deploy-status',
  templateUrl: './deploy-status.component.html',
  styleUrls: ['./deploy-status.component.scss']
})
export class DeployStatusComponent extends Mixin(Core, Stores, Animations) implements OnInit, OnChanges {
  @Input() deploy: string;
  @Input() stageParcial: number; // TODO remove this when endpoint is complete

  private fallBackRequestInterval = 5000;
  private fallBackRequest: any;

  public deployInfo: {
    stageParcial: number;
    stageTotal: number;
    totalStages: number;
    log: string;
    startDate: string;
    endDate: string;
  };

  public deployingTranslation: string;
  public username: string;
  public usernameAcronym: string;

  constructor(
    private readonly deploysService: DeploysService
  ) {
    super();
  }

  ngOnInit() {
    this.deployingTranslation = upperFirst(this.translate('dictionary.deploying'));

    this.resetDeploy();

    this.loader.show('deploy-status');
    this.getDeployInfoFallBack();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.deploy.currentValue !== this.deploy) {
      this.ngOnInit();
    }
  }

  getDeployInfoFallBack() {
    this.deploysService.getDeployStatus(this.deploy, { stageParcial: this.deployInfo.stageParcial}).pipe(take(1)).subscribe(
      (response) => {
        this.loader.hide('deploy-status');
        this.username = response.username;
        const matches = this.username?.match(/\b(\w)/g);
        this.usernameAcronym = matches.join('');

        if (response.stageParcial === response.totalStages) {
          this.deployingTranslation = upperFirst(this.translate('dictionary.completed'));
          this.deployInfo.endDate = timeAgoInWords(new Date().getTime()); // TODO change this when endpoint is completed
          this.deployInfo.stageParcial = response.stageParcial;
          this.deployInfo.stageTotal = response.stageTotal;
          this.deployInfo.totalStages = response.totalStages;
          this.deployInfo.log = this.deployInfo.log.concat(`${response.message || ''}\n`);
          return;
        }

        if (response.stageTotal <= this.deployInfo.stageTotal) {
          this.triggerDeployStatus();
          return;
        }

        this.deployInfo.startDate = timeAgoInWords(response.startDate); // TODO change this when endpoint is completed
        this.deployInfo.stageTotal = response.stageTotal;
        this.deployInfo.stageParcial = response.stageParcial;
        this.deployInfo.totalStages = response.totalStages;
        this.deployInfo.log = this.deployInfo.log.concat(`${response.message || ''}\n`);

        this.triggerDeployStatus();
      },
      () => this.loader.hide('deploy-status')
    );
  }
  triggerDeployStatus() {
    setTimeout(() => {
      this.getDeployInfoFallBack();
    }, this.fallBackRequestInterval);
  }

  onCancelDeploy() {

  }

  resetDeploy() {
    this.deployInfo = {
      stageParcial: this.stageParcial !== null ? this.stageParcial : 0,
      stageTotal: 0,
      totalStages: 1,
      startDate: null,
      endDate: null,
      log: ''
    };
  }

}
