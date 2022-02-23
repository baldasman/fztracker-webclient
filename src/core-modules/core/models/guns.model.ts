export class GunsModel {
  static STATE_ACTIVE = 'ACTIVE';
  static STATE_INACTIVE = 'INACTIVE';

  ArmeiroId: string;
  place: string;
  lastChangeDate: Date;
  state: string;  
  guns: []; // [{}]
  entitySerial: string;
  entitydesc: string;

 
 
   constructor() {

  }
}
