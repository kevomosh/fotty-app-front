import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupInfo } from 'src/app/interfaces/groupInfo';
import { RegisterInfo } from 'src/app/interfaces/registerInfo';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { MustMatch } from '../helper/mustMatchValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errorMessage: string = '';
  groups$: Observable<GroupInfo[]> = this.groupService.getAllGroups();
  // filteredGroups$: Observable<GroupInfo[]>;

  private destroy: Subject<void> = new Subject<void>();
  private destroy1: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private groupService: GroupService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.logInStatus
      .pipe(takeUntil(this.destroy))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) this.router.navigateByUrl('/');
      });

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
      .pipe(takeUntil(this.destroy1))
      .subscribe(
        () => {
          this.registerForm.reset();
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );
  }

  private addGroupFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
    });
  }

  closeAlert() {
    this.errorMessage = '';
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
