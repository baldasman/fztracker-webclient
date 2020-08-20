/**
 * The EventModel class.
 * Represents the definition of the standard approach to a fired event.
 */
export class EventModel<T> {

  type: string;
  data: T;

  /**
   * EventModel contructor.
   * @param type The event type
   * @param data The event payload
   */
  constructor(type: string, data: T) {
    this.type = type;
    this.data = data;
  }

}
