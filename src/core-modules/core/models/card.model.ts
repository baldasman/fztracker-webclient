export class CardModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  uid: string;
  state: string;
  cardNumber: string;
  lastChangeDate: Date;
  entitySerial: string;
  entityType: string;

  // TODO: add missing props
  name: string ;
  rankClass: string;
  totalRegistos: number = 300;

  addDate: string = "17/01/2020";
  cardType: string = "Militar";
  lastRegist: string = "12/09/2020";
  cardStatus: string = "Activo";
  cardStatusColor: string = "label-success"

  constructor() {

  }
}
