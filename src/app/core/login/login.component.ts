import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginInfo } from 'src/app/interfaces/LoginInfo';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  loginForm: FormGroup;
  returnUrl: string;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.returnUrl =
      this.activeRoute.snapshot.queryParams['returnUrl'] || '/results';

    // TODO CHECK IF TOKEN IN LOCALSTORAGE THEN REDIRECT TO HOME ROUTE;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const loginInfo: LoginInfo = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService
      .login(loginInfo)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );

    this.loginForm.reset();
  }

  closeAlert() {
    this.errorMessage = '';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
