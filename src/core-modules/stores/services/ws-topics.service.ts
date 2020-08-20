import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SystemGatewayStatusEnum, SystemGatewayConnectionTypeEnum } from '../system/system.models';

export class WsTopicCMDModel {
  instructionId: string;
  command: 'CMD' | 'GET' | 'DEBUG';
  message: {
    raw: string,
    status?: 'OK' | 'ERROR';
    value?: string | 'ON' | 'OFF'; // GET: a number, DEBUG: ON|OFF.
  };
}

@Injectable()
export class WsTopicsService {

  constructor(
    private logger: NGXLogger,
    private translateService: TranslateService,
    private mqttService: MqttService
  ) { }


  generateInstructionId() { return `MQTT-${Math.round(+new Date() / 1000)}`; }


  observeCMD(serialNumber: string): Observable<WsTopicCMDModel> {

    return this.mqttService.observe(`gateway/${serialNumber}/cmd`).pipe(map((data: IMqttMessage) => {

      this.logger.trace('WS event @ /cmd: ', data.payload.toString());

      try {
        const event = JSON.parse(data.payload.toString()) as { instructionId: string, gateway: string, type: 'CMD' | 'GET', message: string };

        // Message format: TYPE => STATUS: | member=value
        const response: WsTopicCMDModel = { instructionId: event.instructionId, command: null, message: { raw: event.message, status: null } };

        let messageType: string;
        let messageValue: string;
        [messageType, messageValue] = event.message.split('=>');

        if (messageValue.trim().startsWith('ERROR') || messageValue.trim().startsWith('FAIL')) {
          response.command = messageType.trim() as WsTopicCMDModel['command'];
          response.message.status = 'ERROR';
          response.message.value = messageValue;
        } else {
          response.message.status = 'OK';
          switch (messageType.trim()) {
            case 'GET':
              response.command = 'GET';
              response.message.value = messageValue.split('=')[1].trim();
              break;
            default:
              response.command = 'CMD';
              response.message.value = messageValue;
              break;
          }
        }
        return response;

      } catch (error) {
        this.logger.error('WS invalid event @ /cmd: ', data.payload.toString());
        return { instructionId: null, command: 'CMD', message: { raw: data.payload.toString() } };
      }

    }));
  }


  observeConnection(serialNumber: string) {
    return this.mqttService.observe(`gateway/${serialNumber}/connection`).pipe(map((data: IMqttMessage) => {

      this.logger.trace('WS event @ /connection: ', data.payload.toString());

      try {
        const event = JSON.parse(data.payload.toString()) as { gateway: string, type: string, message: { ipAddress?: string, connectionType?: SystemGatewayConnectionTypeEnum, status: string } };

        const response = {
          gateway: event.gateway,
          type: event.type,
          message: { ipAddress: event.message.ipAddress, connectionType: event.message.connectionType, status: { id: null as SystemGatewayStatusEnum, updatedAt: null } }
        };

        switch (event.message.status) {
          case 'CONNECTED':
            response.message.status.id = SystemGatewayStatusEnum.ONLINE;
            response.message.status.updatedAt = Math.floor(Date.now() / 1000);
            break;
          default:
            response.message.status.id = SystemGatewayStatusEnum.OFFLINE;
            response.message.status.updatedAt = Math.floor(Date.now() / 1000);
            break;
        }

        return response;

      } catch (error) {
        this.logger.error('WS invalid event @ /connection: ', data.payload.toString());
      }
    }));
  }

  observeDeploy(serialNumber: string) {

    const deployStatus = [
      'PROGRESS',
      'COMPLETE',
      'ERROR: GATEWAY NOT CONNECTED!',
      'ERROR: EMPTY PROJECT FILE',
      'ERROR: OPENING PROJECT FILE',
      'ERROR: OPENING PROJECT DEFINITIONS FILE',
      'ERROR: UNPACKING PROJECT PACKAGE FILE',
      'ERROR: GETTING PROJECT PACKAGE FILE'
    ];

    return this.mqttService.observe(`gateway/${serialNumber}/deploy`).pipe(map((data: IMqttMessage) => {
      this.logger.trace('WS event @ /deploy: ', data.payload.toString());
      try {
        const sanitizedEvent = data.payload.toString().replace(/\r|\n/g, ' ');
        const event = JSON.parse(sanitizedEvent) as { gateway: string, type: string, message: string };

        const response = {
          gatewaySerialNumber: event.gateway,
          isDeploying: event.message.trim().startsWith('PROGRESS'),
          isCompleted: event.message.trim().startsWith('COMPLETE') || event.message.trim().startsWith('ERROR'),
          status: '' as 'STARTED' | 'DEPLOYING' | 'COMPLETED::OK' | 'COMPLETED::ERROR',
          message: event.message,
          executionPercentage: 0
        };

        if (event.message.startsWith('PROGRESS')) {
          response.status = 'DEPLOYING';
          response.executionPercentage = parseInt(event.message.split(':')[1], 10);
        } else if (event.message.startsWith('COMPLETE')) {
          response.status = 'COMPLETED::OK';
          response.executionPercentage = parseInt(event.message.split(':')[1], 10);
        } else if (event.message.startsWith('ERROR')) {
          response.status = 'COMPLETED::ERROR';
        }

        return response;

      } catch (error) {
        this.logger.error('WS invalid event @ /deploy: ', data.payload.toString());
      }
    }));
  }

  observeDebug(serialNumber: string) {
    return this.mqttService.observe(`gateway/${serialNumber}/debug`).pipe(map((data: IMqttMessage) => {
      this.logger.trace('WS event @ /debug: ', data.payload.toString());
      try {
        return JSON.parse(data.payload.toString()) as { gateway: string, type: string, message: string };
      } catch (error) {
        this.logger.error('WS invalid event @ /debug: ', data.payload.toString());
      }
    }));
  }

  observeRealtime(serialNumber: string) {
    return this.mqttService.observe(`gateway/${serialNumber}/realtime`).pipe(map((data: IMqttMessage) => {
      this.logger.trace('WS event @ /realtime: ', data.payload.toString());
      try {
        return JSON.parse(data.payload.toString()) as { gateway: string, type: string, message: string };
      } catch (error) {
        this.logger.error('WS invalid event @ /realtime: ', data.payload.toString());
      }
    }));
  }

  observeEdge(registrationCode: string) {

    const licensingStatus = {
      'ONGOING::BOOT': 'features.gateway_management.licensing_states.ongoing_boot',
      'ONGOING::WAITING_LICENSE': 'features.gateway_management.licensing_states.ongoing_waiting_license',
      RETRYING: 'features.gateway_management.licensing_states.retrying',
      'COMPLETED::OK': 'features.gateway_management.licensing_states.completed_ok',
      'COMPLETED::ERROR': 'features.gateway_management.licensing_states.completed_error',
      'COMPLETED::ERROR::TIMEOUT': 'features.gateway_management.licensing_states.completed_error_timeout',
      'COMPLETED::ERROR::01': 'features.gateway_management.licensing_states.completed_error_01',
      'COMPLETED::ERROR::02': 'features.gateway_management.licensing_states.completed_error_02',
      'COMPLETED::ERROR::03': 'features.gateway_management.licensing_states.completed_error_03',
      'COMPLETED::ERROR::04': 'features.gateway_management.licensing_states.completed_error_04',
      UNKNOWN: 'features.gateway_management.licensing_states.unknown'
    };

    return this.mqttService.observe(`edge/license/${registrationCode}/status`).pipe(map((data: IMqttMessage) => {

      this.logger.trace(`WS event @ /edge/license/${registrationCode}/status`, data.payload.toString());

      try {

        const event = JSON.parse(data.payload.toString()) as { status: keyof typeof licensingStatus, serialNumber: string, labelKey: string, timestamp: number };

        const response = {
          isCompleted: event.status.startsWith('COMPLETED'),
          isCompletedOk: event.status.startsWith('COMPLETED::OK'),
          message: licensingStatus[event.status] ? licensingStatus[event.status] : licensingStatus.UNKNOWN,
          serialNumber: '',
          labelKey: ''
        };

        if (response.isCompleted) {
          response.serialNumber = event.serialNumber;
          response.labelKey = event.labelKey;
        }

        return response;

      } catch (error) {
        this.logger.error(`WS invalid event @ /edge/license/${registrationCode}/status: `, data.payload.toString());
      }
    }));
  }

}
