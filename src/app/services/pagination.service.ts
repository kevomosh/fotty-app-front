import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserResultInfo } from '../interfaces/userResultInfo';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  page$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(5);
  collectionSize$ = new BehaviorSubject<number>(0);

  paginatedUsers(users$: Observable<UserResultInfo[]>) {
    return combineLatest([
      users$,
      this.page$.asObservable(),
      this.pageSize$.asObservable(),
    ]).pipe(
      map(([users, page, pageSize]) => {
        this.collectionSize$.next(users.length);
        return users
          .map((user, i) => ({ id: i + 1, ...user }))
          .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      })
    );
  }

  get page() {
    return this.page$.getValue();
  }

  get pageSize() {
    return this.pageSize$.getValue();
  }

  get collectionSize() {
    return this.collectionSize$.asObservable();
  }

  set page(i: number) {
    this.page$.next(i);
  }

  set pageSize(i: number) {
    this.pageSize$.next(i);
  }

  resetPage() {
    this.page$.next(1);
  }

  reset() {
    this.pageSize$.next(5);
    this.page$.next(1);
    this.collectionSize$.next(0);
  }
}
