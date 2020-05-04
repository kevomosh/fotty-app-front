import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { UserResultInfo } from 'src/app/interfaces/userResultInfo';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  allResults: UserResultInfo[] = [];
  temp: UserResultInfo[] = [];

  filterSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private weekService: WeekService
  ) {}

  ngOnInit(): void {
    this.authService.userId
      .pipe(
        take(1),
        switchMap((userId) => {
          const weekNumber = this.weekService.getCurrentWeekNumber();
          const userResults = this.weekService.getLatestResults(userId);
          return combineLatest([userResults, weekNumber]).pipe(
            map(([userResults, weekNumber]) => ({
              userResults,
              weekNumber,
            }))
          );
        })
      )
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        this.allResults = result.userResults;
        this.temp = [...this.allResults];
      });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    this.allResults = this.temp.filter(
      (d) => d.name.toLowerCase().indexOf(val) !== -1 || !val
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
