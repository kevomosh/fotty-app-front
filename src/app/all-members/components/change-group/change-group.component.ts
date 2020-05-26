import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { GroupService } from 'src/app/services/group.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-group',
  templateUrl: './change-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./change-group.component.css'],
})
export class ChangeGroupComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private groupService: GroupService,
    private loadingErrorService: LoadingErrorService
  ) {}

  changeForm: FormGroup;

  private destroy: Subject<void> = new Subject<void>();

  allGroups$ = this.groupService.getAllGroups();

  stream$ = combineLatest([
    this.allGroups$,
    this.loadingErrorService.error$,
    this.loadingErrorService.loading$,
  ]).pipe(
    map(([groups, error, loading]) => ({
      groups,
      error,
      loading,
    })),
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

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

  getStreamError$() {
    return this.loadingErrorService.streamError$;
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
    this.loadingErrorService.startLoading();
    const details = this.changeForm.value;
    const infoToSend = {
      groups: details.groups,
    };

    this.userService
      .changeGroups(infoToSend)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loadingErrorService.cancelLoading();
          this.router.navigateByUrl('/results');
        },
        (error) => {
          this.loadingErrorService.cancelLoading();
          this.loadingErrorService.setError(error);
        }
      );
  }

  closeMessages() {
    this.loadingErrorService.cancelError();
  }

  ngOnDestroy() {
    this.loadingErrorService.cancelLoadingAndError();
    this.destroy.next();
    this.destroy.complete();
  }
}
