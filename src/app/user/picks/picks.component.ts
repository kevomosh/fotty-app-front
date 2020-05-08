import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { TeamWonOrSelected } from 'src/app/interfaces/teamWonOrSelected';
import { PickService } from 'src/app/services/pick.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.css'],
})
export class PicksComponent implements OnInit {
  weekNumber: number;
  errorNumber: number;
  teamsThatWon: TeamWonOrSelected[] = [];
  constructor(
    private pickService: PickService,
    private activeRoute: ActivatedRoute,
    private weekService: WeekService,
    private filterService: FilterService,
    private router: Router
  ) {}

  stream$ = this.activeRoute.paramMap.pipe(
    map((routeParam: ParamMap) => {
      this.weekNumber = parseInt(routeParam.get('weekNumber'));
      this.errorNumber = this.weekNumber - 1;

      return this.weekNumber;
    }),
    switchMap((weekNumber) => {
      const allUsers$ = this.pickService
        .getPicksForTheWeek(weekNumber)
        .pipe(tap((users) => this.filterService.updateUserGroups(users)));
      const week$ = this.weekService
        .getWeekByWeekNumber(weekNumber)
        .pipe(tap((week) => (this.teamsThatWon = week.teamsThatWon)));
      const filteredUsers$ = this.filterService.createFilter(allUsers$);

      return combineLatest([filteredUsers$, week$]).pipe(
        map(([filteredUsers, week]) => ({
          filteredUsers,
          week,
        }))
      );
    })
  );

  ngOnInit(): void {}

  loadPreviousWeek() {
    this.router.navigate(['/picks', this.weekNumber - 1]);
  }

  loadFollowingWeek() {
    this.router.navigate(['/picks', this.weekNumber - 1]);
  }

  colorIfCorrect(team: TeamWonOrSelected): boolean {
    if (this.teamsThatWon.length > 0) {
      const z = this.teamsThatWon.find((e) => e.team === team.team);
      if (z) return true;
    }
    return false;
  }

  colorTitleIfHomeCorrect(team: NewMatchToBePlayed): boolean {
    if (this.teamsThatWon.length > 0) {
      const z = this.teamsThatWon.find((e) => e.team === team.homeTeam);
      if (z) return true;
    }
    return false;
  }
  colorTitleIfAwayCorrect(team: NewMatchToBePlayed): boolean {
    if (this.teamsThatWon.length > 0) {
      const z = this.teamsThatWon.find((e) => e.team === team.awayTeam);
      if (z) return true;
    }
    return false;
  }
}
