export class CardModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  uid: string;
  state: string;
  cardNumber: string;
  lastChangeDate: Date;
  entitySerial: string;
  entityType: string;

  constructor() {

  }
}
