import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { GroupInfo } from 'src/app/interfaces/groupInfo';
import { RegisterInfo } from 'src/app/interfaces/registerInfo';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { MustMatch } from '../helper/mustMatchValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private groupService: GroupService,
    private fb: FormBuilder,
    public loadingErrorService: LoadingErrorService
  ) {}

  groups$: Observable<GroupInfo[]> = this.groupService.getAllGroups();

  logInStatus$ = this.authService.logInStatus.pipe(
    tap((loggedIn) => {
      if (loggedIn) this.router.navigateByUrl('/results');
    })
  );

  combined$ = combineLatest([this.groups$, this.logInStatus$]).pipe(
    map(([groups]) => ({
      groups,
    })),
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40),
          ],
        ],
        cpassword: ['', [Validators.required]],
        newGroup: ['', [Validators.minLength(3), Validators.maxLength(15)]],
        groups: this.fb.array([this.addGroupFormGroup()]),
      },
      {
        validator: MustMatch('password', 'cpassword'),
      }
    );
  }

  addGroupButtonClick(): void {
    (<FormArray>this.registerForm.get('groups')).push(this.addGroupFormGroup());
  }

  removeGroupButtonClick(index: number): void {
    this.groupFormArray().removeAt(index);
  }

  groupFormArray() {
    return <FormArray>this.registerForm.get('groups');
  }

  onSubmit() {
    this.loadingErrorService.startLoading();
    this.loadingErrorService.cancelError();

    let details = this.registerForm.value;
    const registerInfo: RegisterInfo = {
      name: details.name,
      email: details.email,
      password: details.password,
      newGroup: details.newGroup,
      groups: details.groups,
    };

    this.authService
      .register(registerInfo)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loadingErrorService.cancelLoading();
          this.registerForm.reset();
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.setError(error);
        }
      );
  }

  private addGroupFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
    });
  }

  loadingMessage(): string {
    return 'Processing your Request....';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
