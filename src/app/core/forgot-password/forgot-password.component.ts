import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errorMessage = '';
  successMessage = '';
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
        (result) => (this.successMessage = result.message),
        (error) => {
          this.errorMessage = error.error.message;
        }
      );

    this.form.reset();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
