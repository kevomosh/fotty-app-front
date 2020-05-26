import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingErrorService {
  private loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private errorSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  private successSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  private streamErrorSubject$: Subject<string> = new Subject();

  constructor() {}

  startLoading() {
    this.loadingSubject$.next(true);
  }

  cancelLoading() {
    this.loadingSubject$.next(false);
  }

  get loading$() {
    return this.loadingSubject$.asObservable();
  }

  cancelLoadingAndError() {
    this.cancelLoading();
    this.cancelError();
  }

  cancelLoadingAndErrorAndSuccess() {
    this.cancelLoading();
    this.cancelError();
    this.cancelSuccess();
  }

  autoCloseErrorAlert(res: HttpErrorResponse) {
    this.setError(res);
    setTimeout(() => {
      this.cancelError();
    }, 5000);
  }

  setSuccess(message: string) {
    this.successSubject$.next(message);
  }

  get success$() {
    return this.successSubject$.asObservable();
  }

  cancelSuccess() {
    this.successSubject$.next('');
  }

  cancelError() {
    this.errorSubject$.next('');
  }

  cancelStreamError() {
    this.streamErrorSubject$.next();
  }

  get error$() {
    return this.errorSubject$.asObservable();
  }

  setError(res: HttpErrorResponse) {
    this.errorSubject$.next(res.error.message);
  }

  get streamError$() {
    return this.streamErrorSubject$.asObservable();
  }

  setStreamError(res: HttpErrorResponse) {
    this.streamErrorSubject$.next(res.error.message);
  }
}
