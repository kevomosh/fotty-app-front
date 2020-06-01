import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { WeekInfo } from 'src/app/interfaces/weekInfo';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-post-results',
  templateUrl: './post-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./post-results.component.css'],
})
export class PostResultsComponent implements OnInit, OnDestroy {
  constructor(
    private weekService: WeekService,
    private fb: FormBuilder,
    private router: Router,
    public loadingErrorService: LoadingErrorService
  ) {}

  resultForm: FormGroup;
  weekNumber: number;
  controls: any;
  private destroy: Subject<void> = new Subject<void>();

  week$ = this.weekService.getFilteredMatches().pipe(
    tap((week) => {
      this.weekNumber = week.weekNumber;
      this.upDateForm(week);
      this.controls = this.teamsThatWonArrayControls();
    }),
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
    this.resultForm = this.fb.group({
      weeksResult: this.fb.array([]),
    });
  }

  onSubmit() {
    this.loadingErrorService.startLoading();

    const result = this.resultForm.value;
    const unfiltered = result.weeksResult.filter((game) => game.team !== '');
    const weekInfo: WeekInfo = {
      weekNumber: this.weekNumber,
      teamsThatWon: unfiltered.map((e) => ({
        gameNumber: e.gameNumber,
        team: e.team,
      })),
    };

    this.weekService
      .addResultsUpdateScore(weekInfo)
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

  updateTotalScore() {
    this.loadingErrorService.startLoading();

    this.weekService
      .updateTotalScore(this.weekNumber)
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

  private upDateForm(week: WeekInfo) {
    let arr = [];
    week.filteredMatches.forEach((match) => {
      arr.push(this.buildMatch(match));
    });

    this.resultForm.setControl('weeksResult', this.fb.array(arr));
  }

  private buildMatch(match: NewMatchToBePlayed): FormGroup {
    return this.fb.group({
      gameNumber: [match.gameNumber],
      team: ['', Validators.required],
      homeTeam: [match.homeTeam],
      awayTeam: [match.awayTeam],
    });
  }

  private teamsThatWonArrayControls() {
    return (<FormArray>this.resultForm.get('weeksResult')).controls;
  }

  loadingMessage(): string {
    return 'Loading......';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
