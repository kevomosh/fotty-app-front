import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { PickInfo } from 'src/app/interfaces/pickInfo';
import { WeekInfo } from 'src/app/interfaces/weekInfo';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { PickService } from 'src/app/services/pick.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-make-pick',
  templateUrl: './make-pick.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./make-pick.component.css'],
})
export class MakePickComponent implements OnInit, OnDestroy {
  constructor(
    private weekService: WeekService,
    private authService: AuthService,
    private pickService: PickService,
    private fb: FormBuilder,
    private router: Router,
    private loadingErrorServive: LoadingErrorService
  ) {}

  pickForm: FormGroup;
  controls: any;
  weekNumber: number;
  userId: number;

  private destroy: Subject<void> = new Subject<void>();

  week$ = this.authService.userId.pipe(
    tap((id) => (this.userId = id)),
    switchMap(() =>
      this.weekService.getCurrentWeek().pipe(
        tap((week) => {
          this.weekNumber = week.weekNumber;
          this.upDateForm(week);
          this.controls = this.teamsSelectedArrayControls();
        })
      )
    ),
    catchError((error) => {
      this.loadingErrorServive.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
    this.pickForm = this.fb.group({
      teamsSelected: this.fb.array([]),
    });
  }

  private upDateForm(week: WeekInfo) {
    let arr = [];
    week.sortedMatchesToBePlayed.forEach((match) => {
      arr.push(this.buildPick(match));
    });

    this.pickForm.setControl('teamsSelected', this.fb.array(arr));
  }

  private buildPick(pick: NewMatchToBePlayed): FormGroup {
    return this.fb.group({
      gameNumber: [pick.gameNumber],
      team: ['', Validators.required],
      homeTeam: [pick.homeTeam],
      awayTeam: [pick.awayTeam],
    });
  }

  private teamsSelectedArrayControls() {
    return (<FormArray>this.pickForm.get('teamsSelected')).controls;
  }

  onSubmit() {
    this.loadingErrorServive.startLoading();
    this.loadingErrorServive.cancelError();
    const result = this.pickForm.value;

    const pickInfo: PickInfo = {
      userId: this.userId,
      weekNumber: this.weekNumber,
      teamsSelected: result.teamsSelected.map((elem) => ({
        gameNumber: elem.gameNumber,
        team: elem.team,
      })),
    };

    this.pickService
      .createOrUpdatePick(pickInfo)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loadingErrorServive.cancelLoading();
          this.router.navigate(['/picks', this.weekNumber]);
        },
        (error) => {
          this.loadingErrorServive.cancelLoading();
          this.loadingErrorServive.autoCloseErrorAlert(error);
        }
      );
  }

  loadingMessage(): string {
    return 'Processing your pick, just relax.....';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
