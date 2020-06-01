import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { MustMatch } from '../helper/mustMatchValidator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingErrorService: LoadingErrorService
  ) {}

  token = '';
  id;
  resetForm: FormGroup;

  private destroy: Subject<void> = new Subject<void>();

  params$ = this.activeRoute.queryParams.pipe(
    tap((result) => {
      this.token = result.token;
      this.id = result.id;
    })
  );

  loginStatus$ = this.authService.logInStatus.pipe(
    tap((loggedIn) => {
      if (loggedIn) this.router.navigateByUrl('/results');
    })
  );

  stream$ = combineLatest([this.params$, this.loginStatus$]).pipe(
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40),
          ],
        ],
        cpassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'cpassword'),
      }
    );
  }

  onSubmit() {
    this.loadingErrorService.startLoading();
    this.loadingErrorService.cancelError();
    const info = {
      token: this.token,
      id: this.id,
      password: this.resetForm.value.password,
    };

    console.log(info);

    this.authService
      .resetPassword(info)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loadingErrorService.cancelLoading();
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.autoCloseErrorAlert(error);
        }
      );

    this.resetForm.disabled;
    this.resetForm.reset();
  }

  loadingMessage(): string {
    return 'Trying to change your password......';
  }

  ngOnDestroy() {
    this.loadingErrorService.cancelLoadingAndError();
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
