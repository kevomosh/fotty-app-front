import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { PickService } from 'src/app/services/pick.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./picks.component.css'],
})
export class PicksComponent implements OnInit, OnDestroy {
  weekNumber: number;
  stream$: Observable<any>;
  errorSubject$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private pickService: PickService,
    private activeRoute: ActivatedRoute,
    private weekService: WeekService,
    private filterService: FilterService,
    private router: Router,
    public loadingErrorService: LoadingErrorService,
    public paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.stream$ = this.activeRoute.paramMap.pipe(
      map((routeParam: ParamMap) => {
        return parseInt(routeParam.get('weekNumber'));
      }),

      mergeMap((weekNumber) => {
        this.filterService.clearAllFilterInputs();
        this.clearSubjects();
        this.paginationService.resetPage();
        console.log('reset');
        this.weekNumber = weekNumber;

        const week$ = this.weekService.getWeekByWeekNumber(weekNumber);

        const allUsers$ = this.pickService.getPicksForTheWeek(weekNumber).pipe(
          catchError((error) => {
            this.loadingErrorService.setError(error);
            return of([]);
          })
        );

        const filteredUsers$ = this.filterService.createFilter(allUsers$);
        const paginatedUsers$ = this.paginationService.paginatedUsers(
          filteredUsers$
        );
        const currentWeekNumber$ = this.weekService.weekNumber;
        const title$ = of('Picks For Round ' + weekNumber);

        return combineLatest([
          week$,
          paginatedUsers$,
          currentWeekNumber$,
          title$,
          this.loadingErrorService.error$,
        ]).pipe(
          map(([week, paginatedUsers, currentWeekNumber, title, err]) => ({
            week,
            paginatedUsers,
            currentWeekNumber,
            title,
            err,
          })),
          catchError((error) => {
            this.errorSubject$.next(error.error.message);
            return throwError(error);
          })
        );
      })
    );
  }

  clearSubjects() {
    this.loadingErrorService.cancelError();
    this.errorSubject$.next('');
  }

  errorLoadWeekBefore(weekNumber: number) {
    this.clearSubjects();
    this.loadWeek(weekNumber);
    this.ngOnInit();
  }

  loadWeek(weekNumber: number) {
    this.router.navigate(['/picks', weekNumber]);
  }

  ngOnDestroy() {
    this.filterService.clearAllFilterInputs();
    this.clearSubjects();
    this.paginationService.reset();
  }
}
