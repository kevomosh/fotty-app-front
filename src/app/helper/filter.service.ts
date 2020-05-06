import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private inputSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private groupSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'AllGroups'
  );

  constructor() {}

  updateInputFilter(event: any) {
    this.inputSubject.next(event.target.value.toLowerCase());
  }

  updateGroupFilter(groupName: string) {
    this.groupSubject.next(groupName);
  }

  getNameStringFilter(): Observable<string> {
    return this.inputSubject.asObservable();
  }

  getGroupStringFilter(): Observable<string> {
    return this.groupSubject.asObservable();
  }
}
