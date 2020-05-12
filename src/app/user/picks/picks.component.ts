import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { TeamWonOrSelected } from 'src/app/interfaces/teamWonOrSelected';
import { UserResultInfo } from 'src/app/interfaces/userResultInfo';
import { PickService } from 'src/app/services/pick.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./picks.component.css'],
})
export class PicksComponent implements OnInit {
  weekNumber: number;
  errorObject = null;
  stream$: Observable<any>;

  filteredUsers: UserResultInfo[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = this.filteredUsers.length;

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
        this.weekNumber = weekNumber;

        const week$ = this.weekService.getWeekByWeekNumber(weekNumber);

        const allUsers$ = this.pickService.getPicksForTheWeek(weekNumber);
        const filteredUsers$ = this.filterService
          .createFilter(allUsers$)
          .pipe(tap((users) => (this.filteredUsers = users)));

        const currentWeekNumber$ = this.weekService.weekNumber;
        const title$ = of('Picks For Round ' + weekNumber);
        this.filterService.clearAllFilterInputs();

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
            this.errorObject = error;
            return throwError(error);
          })
        );
      })
    );
  }

  errorLoadWeekBefore(weekNumber: number) {
    this.errorObject = null;
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
    if (teamsThatWon.length > 0) {
      const z = teamsThatWon.find((e) => e.team === team.team);
      if (z) return true;
    }
    return false;
  }

  colorTitleIfHomeCorrect(
    team: NewMatchToBePlayed,
    teamsThatWon: TeamWonOrSelected[]
  ): boolean {
    if (teamsThatWon.length > 0) {
      const z = teamsThatWon.find((e) => e.team === team.homeTeam);
      if (z) return true;
    }
    return false;
  }
  colorTitleIfAwayCorrect(
    team: NewMatchToBePlayed,
    teamsThatWon: TeamWonOrSelected[]
  ): boolean {
    if (teamsThatWon.length > 0) {
      const z = teamsThatWon.find((e) => e.team === team.awayTeam);
      if (z) return true;
    }
    return false;
  }

  get paginatedUsers(): UserResultInfo[] {
    return this.filteredUsers
      .map((user, i) => ({ id: i + 1, ...user }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  ngOnDestroy() {
    this.filterService.clearAllFilterInputs();
  }
}
