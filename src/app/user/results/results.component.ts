import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GroupInfo } from 'src/app/interfaces/groupInfo';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  userGroups: GroupInfo[] = [];
  private inputSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
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

      const filteredUsers$ = combineLatest([
        userResults,
        this.inputSubject.asObservable(),
      ]).pipe(
        map(([users, filterString]) =>
          users.filter(
            (user) =>
              user.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
          )
        )
      );

      return combineLatest([filteredUsers$, weekNumberString$]).pipe(
        map(([filteredUsers, weekNumberString]) => ({
          filteredUsers,
          weekNumberString,
        }))
      );
    })
  );

  updateFilter(event: any) {
    this.inputSubject.next(event.target.value.toLowerCase());
  }

  ngOnInit(): void {}

  ngOnDestroy() {}
}
