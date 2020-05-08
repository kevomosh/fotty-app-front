import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { WeekInfo } from 'src/app/interfaces/weekInfo';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-post-results',
  templateUrl: './post-results.component.html',
  styleUrls: ['./post-results.component.css'],
})
export class PostResultsComponent implements OnInit, OnDestroy {
  resultForm: FormGroup;
  weekNumber: number;
  controls: any;
  private destroy: Subject<void> = new Subject<void>();
  constructor(
    private weekService: WeekService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  stream$ = this.weekService.getFilteredMatches().pipe(
    tap((week) => {
      this.weekNumber = week.weekNumber;
      this.upDateForm(week);
      this.controls = this.teamsThatWonArrayControls();
    })
  );

  ngOnInit(): void {
    this.resultForm = this.fb.group({
      weeksResult: this.fb.array([]),
    });
  }

  onSubmit() {
    const result = this.resultForm.value;
    const unfiltered = result.weeksResult.filter((game) => game.team !== '');
    const weekInfo: WeekInfo = {
      weekNumber: this.weekNumber,
      teamsThatWon: unfiltered.map((e) => ({
        gameNumber: e.gameNumber,
        team: e.team,
      })),
    };

    //console.log(weekInfo);

    this.weekService
      .addResultsUpdateScore(weekInfo)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.router.navigateByUrl('/results');
        },
        (error) => {
          console.log('error occured' + error);
        }
      );

    // this.weekService.addResultsUpdateScore(weekInfo).subscribe(
    //   (r) => {
    //     if (r) {
    //       console.log(r);
    //       console.log(weekInfo);
    //       this.router.navigateByUrl('/results');
    //     }
    //   },
    //   (error) => {
    //     console.log('error' + error.error);
    //   }
    // );
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
