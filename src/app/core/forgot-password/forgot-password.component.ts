import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errorSubject: BehaviorSubject<string> = new BehaviorSubject('');
  successSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  private destroy: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const info = {
      email: this.form.value.email,
    };

    this.authService
      .forgotPassword(info)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (result) => this.successSubject$.next(result.message),
        (error) => {
          // this.errorSuccessService.setErrorMessage(error.error.message);
          this.errorSubject.next(error.error.message);
          // //this.errorMessage = error.error.message;
        }
      );

    this.form.reset();
  }

  getError$() {
    return this.errorSubject.asObservable();
  }

  getSuccess$() {
    return this.successSubject$.asObservable();
  }

  closeMessages() {
    this.errorSubject.next('');
    this.successSubject$.next('');
  }
  ngOnDestroy() {
    this.closeMessages();
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
