import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NewMatchToBePlayed } from 'src/app/interfaces/newMatchToBePlayed';
import { TeamWonOrSelected } from 'src/app/interfaces/teamWonOrSelected';
import { UserResultInfo } from 'src/app/interfaces/userResultInfo';
import { WeekInfo } from 'src/app/interfaces/weekInfo';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'pick-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() week: WeekInfo;
  @Input() paginatedUsers: UserResultInfo[];

  constructor(public paginationService: PaginationService) {}

  colorIfCorrect(team: TeamWonOrSelected): boolean {
    return this.week.teamsThatWon.length > 0
      ? this.week.teamsThatWon.map((e) => e.team).includes(team.team)
      : false;
  }

  colorTitleIfHomeCorrect(team: NewMatchToBePlayed): boolean {
    return this.week.teamsThatWon.length > 0
      ? this.week.teamsThatWon.map((e) => e.team).includes(team.homeTeam)
      : false;
  }

  colorTitleIfAwayCorrect(team: NewMatchToBePlayed): boolean {
    return this.week.teamsThatWon.length > 0
      ? this.week.teamsThatWon.map((e) => e.team).includes(team.awayTeam)
      : false;
  }
}
