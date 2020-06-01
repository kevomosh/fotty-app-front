import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { LoginInfo } from 'src/app/interfaces/LoginInfo';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  loginForm: FormGroup;
  returnUrl: string;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private loadingErrorService: LoadingErrorService
  ) {}

  logInStatus$ = this.authService.logInStatus.pipe(
    tap((loggedIn) => {
      if (loggedIn) this.router.navigateByUrl('/results');
    })
  );

  stream$ = combineLatest([
    this.logInStatus$,
    this.loadingErrorService.loading$,
    this.loadingErrorService.error$,
  ]).pipe(
    map(([loginStatus, loading, error]) => ({
      loginStatus,
      loading,
      error,
    }))
  );

  ngOnInit(): void {
    this.returnUrl =
      this.activeRoute.snapshot.queryParams['returnUrl'] || '/results';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
        ],
      ],
    });
  }

  onSubmit() {
    this.loadingErrorService.startLoading();
    this.loadingErrorService.cancelError();

    const loginInfo: LoginInfo = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService
      .login(loginInfo)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loadingErrorService.cancelLoading();
          this.router.navigateByUrl(this.returnUrl);
        },
        (error) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.autoCloseErrorAlert(error);
        }
      );

    this.loginForm.reset();
  }

  ngOnDestroy() {
    this.loadingErrorService.cancelLoadingAndError();
    this.destroy.next();
    this.destroy.complete();
  }

  loggingMessage(): string {
    return 'Logging you in';
  }

  errorMessage(): string {
    return '!!!!. Please try again';
  }
}
