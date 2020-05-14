import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  constructor(
    private weekService: WeekService,
    private filterService: FilterService
  ) {}

  weekNumberString$ = this.weekService
    .getCurrentWeekNumber()
    .pipe(map((number) => 'Results after ' + (number - 1) + ' rounds'));

  userResults$ = this.weekService.getLatestResults();

  filteredusers$ = this.filterService.createFilter(this.userResults$);

  combined$ = combineLatest([this.filteredusers$, this.weekNumberString$]).pipe(
    map(([filteredUsers, weekNumberString]) => ({
      filteredUsers,
      weekNumberString,
    }))
  );
}
