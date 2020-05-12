import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupInfo } from '../interfaces/groupInfo';
import { UserResultInfo } from '../interfaces/userResultInfo';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private inputSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private userGroups$: BehaviorSubject<GroupInfo[]> = new BehaviorSubject([]);

  private groupSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'AllGroups'
  );

  constructor() {}

  clearAllFilterInputs() {
    this.inputSubject$.next('');
    this.userGroups$.next([]);
    this.groupSubject$.next('AllGroups');
  }

  updateInputFilter(event: any) {
    this.inputSubject$.next(event.target.value.toLowerCase());
  }

  updateInputFilterForm(event: any) {
    this.inputSubject$.next(event);
  }

  getGroupSubject(): Observable<string> {
    return this.groupSubject$.asObservable();
  }

  updateGroupFilter(groupName: string) {
    this.groupSubject$.next(groupName);
  }

  getNameStringFilter(): Observable<string> {
    return this.inputSubject$.asObservable();
  }

  getGroupStringFilter(): Observable<string> {
    return this.groupSubject$.asObservable();
  }

  getUserGroups(): Observable<GroupInfo[]> {
    return this.userGroups$.asObservable();
  }

  createFilter(
    userResults$: Observable<UserResultInfo[]>
  ): Observable<UserResultInfo[]> {
    return combineLatest([
      userResults$,
      this.getNameStringFilter(),
      this.getGroupStringFilter(),
    ]).pipe(
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
}
