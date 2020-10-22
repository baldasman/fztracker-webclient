export class CardModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  uid: string;
  state: string;
  cardNumber: string;
  lastChangeDate: Date;
  entityType: string;

  // TODO: add missing props
  
  entitySerial: string;
  entityName: string ;
  entityRankClass: string;
  totalRegistos: number;;
  cardaddDate: Date;
 

 

  constructor() {

  }
}
