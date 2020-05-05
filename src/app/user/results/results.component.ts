import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GroupInfo } from 'src/app/interfaces/groupInfo';
import { UserResultInfo } from 'src/app/interfaces/userResultInfo';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  userGroups: GroupInfo[] = [];
  private inputSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private groupSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'AllGroups'
  );

  constructor(
    private authService: AuthService,
    private weekService: WeekService
  ) {}

  combined$ = this.authService.userId.pipe(
    switchMap((id) => {
      const weekNumberString$ = this.weekService
        .getCurrentWeekNumber()
        .pipe(map((number) => 'Results after ' + (number - 1) + ' rounds'));

      const userResults = this.weekService.getLatestResults(id).pipe(
        tap((allUsers) => {
          const username = localStorage.getItem('userName');
          this.userGroups = allUsers.find(
            (user) => user.name === username
          ).groups;
        })
      );

      const filteredUsers$ = this.createFilter(
        userResults,
        this.inputSubject.asObservable(),
        this.groupSubject.asObservable()
      );

      return combineLatest([filteredUsers$, weekNumberString$]).pipe(
        map(([filteredUsers, weekNumberString]) => ({
          filteredUsers,
          weekNumberString,
        }))
      );
    })
  );

  private createFilter(
    userResults$: Observable<UserResultInfo[]>,
    filterString$: Observable<string>,
    groupName$: Observable<string>
  ) {
    return combineLatest([userResults$, filterString$, groupName$]).pipe(
      map(([users, filterString, groupName]) => {
        const filteredUsersByName = users.filter(
          (user) =>
            user.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
        );
        if (groupName === 'AllGroups') {
          return filteredUsersByName;
        } else {
          return filteredUsersByName.filter((uz) =>
            uz.groups.some((g) => g.name === groupName)
          );
        }
      })
    );
  }

  updateFilter(event: any) {
    this.inputSubject.next(event.target.value.toLowerCase());
  }

  filterGroup(groupName: string) {
    this.groupSubject.next(groupName);
  }
}
