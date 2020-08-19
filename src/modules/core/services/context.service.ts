import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContextService {

  private referrer: string;

  constructor() { }

  setReferrer(referrer: string): void {
    this.referrer = referrer;
  }

  getReferrer(): string {
    return this.referrer;
  }
}
