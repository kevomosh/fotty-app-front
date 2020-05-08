import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FilterService } from 'src/app/helper/filter.service';
import { GroupInfo } from 'src/app/interfaces/groupInfo';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  userGroups: GroupInfo[] = [];

  constructor(
    private authService: AuthService,
    private weekService: WeekService,
    private filterService: FilterService
  ) {}

  combined$ = this.authService.userId.pipe(
    switchMap((id) => {
      const weekNumberString$ = this.weekService
        .getCurrentWeekNumber()
        .pipe(map((number) => 'Results after ' + (number - 1) + ' rounds'));

      const userResults = this.weekService.getLatestResults(id).pipe(
        tap((allUsers) => {
          this.filterService.updateUserGroups(allUsers);
        })
      );

      const filteredUsers$ = this.filterService.createFilter(userResults);

      return combineLatest([filteredUsers$, weekNumberString$]).pipe(
        map(([filteredUsers, weekNumberString]) => ({
          filteredUsers,
          weekNumberString,
        }))
      );
    })
  );
}
