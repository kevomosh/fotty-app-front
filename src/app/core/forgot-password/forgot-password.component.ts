import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private loadingErrorService: LoadingErrorService
  ) {}

  form: FormGroup;
  private destroy: Subject<void> = new Subject<void>();

  logInStatus$ = this.authService.logInStatus.pipe(
    tap((loggedIn) => {
      if (loggedIn) this.router.navigateByUrl('/results');
    })
  );

  stream$ = combineLatest([
    this.loadingErrorService.success$,
    this.loadingErrorService.error$,
    this.loadingErrorService.loading$,
    this.logInStatus$,
  ]).pipe(
    map(([success, error, loading]) => ({
      success,
      error,
      loading,
    })),
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.loadingErrorService.startLoading();
    this.closeError();

    const info = {
      email: this.form.value.email,
    };

    this.authService
      .forgotPassword(info)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (result) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.setSuccess(result.message);
        },
        (error) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.autoCloseErrorAlert(error);
        }
      );

    this.form.reset();
  }

  closeError() {
    this.loadingErrorService.cancelError();
  }

  closeSuccess() {
    this.loadingErrorService.cancelSuccess();
  }

  getStreamError$() {
    return this.loadingErrorService.streamError$;
  }

  ngOnDestroy() {
    this.loadingErrorService.cancelLoadingAndErrorAndSuccess();
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
