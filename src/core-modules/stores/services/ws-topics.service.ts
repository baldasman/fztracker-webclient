import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { map } from 'rxjs/operators';


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
