import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from '../helper/mustMatchValidator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  id;
  resetForm: FormGroup;
  errorMessage = '';
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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

    this.activeRoute.queryParams
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        this.token = result.token;
        this.id = result.id;
      });
  }

  onSubmit() {
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
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );

    this.resetForm.disabled;
    this.resetForm.reset();
  }
}
