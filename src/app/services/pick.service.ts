import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickInfo } from '../interfaces/pickInfo';
import { UserResultInfo } from '../interfaces/userResultInfo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PickService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private baseUrl = environment.apiEndpoint;
  private createOrUpdateUrl = `${this.baseUrl}/pick/createOrUpdatePick`;
  private getPicksForTheWeekUrl = `${this.baseUrl}/pick/getPicksForTheWeek/`;

  createOrUpdatePick(pickInfo: PickInfo): Observable<any> {
    return this.http.post<any>(this.createOrUpdateUrl, pickInfo);
  }

  getPicksForTheWeek(weekNumber: number): Observable<UserResultInfo[]> {
    return this.authService.userId.pipe(
      switchMap((userId) =>
        this.http.get<UserResultInfo[]>(
          this.getPicksForTheWeekUrl + weekNumber + '/' + userId
        )
      )
    );
  }
}
