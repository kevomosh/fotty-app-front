import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { UserResultInfo } from 'src/app/interfaces/userResultInfo';
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

  constructor(
    private pickService: PickService,
    private activeRoute: ActivatedRoute,
    private weekService: WeekService,
    private filterService: FilterService,
    private router: Router,
    public loadingErrorService: LoadingErrorService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.stream$ = this.activeRoute.paramMap.pipe(
      switchMap((routeParam: ParamMap) => {
        const weekNumber = parseInt(routeParam.get('weekNumber'));
        this.filterService.clearAllFilterInputs();
        this.clearSubjects();

        this.paginationService.resetPage();
        this.weekNumber = weekNumber;

        const week$ = this.weekService.getWeekByWeekNumber(weekNumber);

        const paginatedUsers$ = this.getPaginatedUsers(weekNumber);
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
            this.loadingErrorService.setStreamError(error);
            return throwError(error);
          })
        );
      })
    );
  }

  getPaginatedUsers(weekNumber: number): Observable<UserResultInfo[]> {
    const allUsers$ = this.pickService.getPicksForTheWeek(weekNumber).pipe(
      catchError((error) => {
        this.loadingErrorService.setError(error);
        return of([]);
      })
    );
    const filteredUsers$ = this.filterService.createFilter(allUsers$);

    return this.paginationService.paginatedUsers(filteredUsers$);
  }

  clearSubjects() {
    this.loadingErrorService.cancelError();
    this.loadingErrorService.cancelStreamError();
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
