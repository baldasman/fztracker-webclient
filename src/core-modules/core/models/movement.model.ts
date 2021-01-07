export class MovementModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  uid: string;
  movementDate: Date;
  location: string;
  sensor: string;
  inOut: boolean;
  manual: boolean;
  entitySerial: string;
  entityName: string;
  entityType: string;
  cardId: string;
  cardNumber: string;
  plate: string;
  relatedMovements: string[];
 

 

  constructor() {

  }
}
