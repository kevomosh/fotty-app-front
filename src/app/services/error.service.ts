import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  successSubject$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  setError(error: string) {
    this.errorSubject$.next(error);
  }

  setSuccess(message: string) {
    this.successSubject$.next(message);
  }

  getError$() {
    return this.errorSubject$.asObservable();
  }

  getSuccess$() {
    return this.successSubject$.asObservable();
  }

  clearMessages() {
    this.errorSubject$.next('');
    this.successSubject$.next('');
  }

  clearError() {
    this.errorSubject$.next('');
  }
}
