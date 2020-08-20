import { v4 as uuid } from 'uuid';

/**
 * The ButtonBarActionsModel class.
 * It represents a button on an action bar.
 */
export class ButtonModel {
  key?: string;
  /**
   * The icon to be displayed
   */
  icon?: string;
  /**
   * A label to be displayed
   */
  label?: string;
  /**
   * The item css style classes
   */
  style?: string;
  /**
   * The action to be fired when clicking on the item
   */
  onClick: (...args: any[]) => any;

  constructor(button: ButtonModel) {
    this.key = button.key || uuid();
    this.icon = button.icon;
    this.label = button.label;
    this.style = button.style;
    this.onClick = button.onClick;
  }
}
