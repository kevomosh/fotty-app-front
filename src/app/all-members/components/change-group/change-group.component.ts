import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-group',
  templateUrl: './change-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./change-group.component.css'],
})
export class ChangeGroupComponent implements OnInit, OnDestroy {
  changeForm: FormGroup;

  errorSubject$: Subject<string> = new Subject();
  groupErrorSubject$: Subject<string> = new Subject();
  private destroy: Subject<void> = new Subject<void>();

  allGroups$ = this.groupService.getAllGroups().pipe(
    catchError((error) => {
      this.groupErrorSubject$.next(error.error.message);
      return throwError(error);
    })
  );

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.changeForm = this.fb.group({
      groups: this.fb.array([this.addGroupFormGroup()]),
    });
  }

  private addGroupFormGroup(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
    });
  }

  addGroupButtonClick(): void {
    (<FormArray>this.changeForm.get('groups')).push(this.addGroupFormGroup());
  }

  removeGroupButtonClick(index: number): void {
    this.groupFormArray().removeAt(index);
  }

  groupFormArray() {
    return <FormArray>this.changeForm.get('groups');
  }

  onSubmit() {
    const details = this.changeForm.value;
    const infoToSend = {
      groups: details.groups,
    };

    this.userService
      .changeGroups(infoToSend)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.router.navigateByUrl('/results');
        },
        (error) => {
          this.errorSubject$.next(error.error.message);
        }
      );
  }

  closeMessages() {
    this.errorSubject$.next();
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
