import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {

  private storeId: string;
  private stateBS: BehaviorSubject<T>;  // Using a behavior subject so we can provide a default value.
  private stateO$: Observable<T>;

  get state() { return this.stateBS.getValue(); }
  get state$() { return this.stateO$; }

  constructor(storeId: string, initialState: T) {

    this.storeId = storeId;
    this.stateBS = new BehaviorSubject(initialState);
    this.stateO$ = this.stateBS.asObservable();

  }

  getStoreId() { return this.storeId; }
  setStoreId(s: string) { this.storeId = s; }

  getStorageState(storeId: string): T {
    const ls = localStorage.getItem(storeId);
    return ls ? JSON.parse(ls) : null;
  }

  setState(nextState: T): void {
    this.stateBS.next(nextState);
  }

  setStateAndSave(nextState: T): void {
    this.stateBS.next(nextState);
    localStorage.setItem(this.storeId, JSON.stringify(this.state));
  }

}
