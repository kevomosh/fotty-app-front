import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { LoadingErrorService } from 'src/app/services/loading-error.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnDestroy {
  constructor(
    private weekService: WeekService,
    private filterService: FilterService,
    private loadingErrorService: LoadingErrorService
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
    })),
    catchError((error) => {
      this.loadingErrorService.setStreamError(error);
      return throwError(error);
    })
  );

  ngOnDestroy() {
    this.filterService.clearAllFilterInputs();
  }
}
