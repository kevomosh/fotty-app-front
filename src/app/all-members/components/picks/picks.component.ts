import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { TeamWonOrSelected } from 'src/app/interfaces/teamWonOrSelected';
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
  errorSubject$: Subject<string> = new Subject();

  constructor(
    private pickService: PickService,
    private activeRoute: ActivatedRoute,
    private weekService: WeekService,
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stream$ = this.activeRoute.paramMap.pipe(
      map((routeParam: ParamMap) => {
        return parseInt(routeParam.get('weekNumber'));
      }),
      switchMap((weekNumber) => {
        this.filterService.clearAllFilterInputs();
        this.clearError();
        this.weekNumber = weekNumber;
        const week$ = this.weekService.getWeekByWeekNumber(weekNumber);

        const allUsers$ = this.pickService.getPicksForTheWeek(weekNumber);
        const filteredUsers$ = this.filterService.createFilter(allUsers$);

        const currentWeekNumber$ = this.weekService.weekNumber;
        const title$ = of('Picks For Round ' + weekNumber);

        return combineLatest([
          week$,
          filteredUsers$,
          currentWeekNumber$,
          title$,
        ]).pipe(
          map(([week, filteredUsers, currentWeekNumber, title]) => ({
            week,
            filteredUsers,
            currentWeekNumber,
            title,
          })),
          catchError((error) => {
            this.errorSubject$.next(error.error.message);

            return throwError(error);
          })
        );
      })
    );
  }

  clearError() {
    this.errorSubject$.next();
    //this.errorSubject$.next('');
  }

  errorLoadWeekBefore(weekNumber: number) {
    this.loadWeek(weekNumber);
    this.ngOnInit();
  }

  loadWeek(weekNumber: number) {
    this.router.navigate(['/picks', weekNumber]);
  }

  makePick() {
    this.router.navigateByUrl('/make-pick');
  }

  colorIfCorrect(
    team: TeamWonOrSelected,
    teamsThatWon: TeamWonOrSelected[]
  ): boolean {
    const z = teamsThatWon.find((e) => e.team === team.team);
    return teamsThatWon.length > 0 && z ? true : false;
  }

  colorTitleIfHomeCorrect(
    team: NewMatchToBePlayed,
    teamsThatWon: TeamWonOrSelected[]
  ): boolean {
    const z = teamsThatWon.find((e) => e.team === team.homeTeam);
    return teamsThatWon.length > 0 && z ? true : false;
  }

  colorTitleIfAwayCorrect(
    team: NewMatchToBePlayed,
    teamsThatWon: TeamWonOrSelected[]
  ): boolean {
    const z = teamsThatWon.find((e) => e.team === team.awayTeam);
    return teamsThatWon.length > 0 && z ? true : false;
  }

  ngOnDestroy() {
    this.filterService.clearAllFilterInputs();
    this.clearError();
  }
}
