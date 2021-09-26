export class EntityModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  nopermanent: [];
  state: string;
  inOut: boolean;
  lastMovementDate: Date;
  cardId: string;
  cardNumber: string;
  movements: [];
  log: [];
  resources: [];
  serial: string;
  lastlocal: string;

 

  constructor() {

  }
}
