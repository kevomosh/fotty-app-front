import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResultInfo } from '../interfaces/userResultInfo';
import { WeekInfo } from '../interfaces/weekInfo';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  private baseUrl = environment.apiEndpoint;
  private getLatestResultsUrl: string = `${this.baseUrl}/week/latestResults/`;
  private getCurrentWeekNumberUrl: string = `${this.baseUrl}/week/currentWeekNumber`;
  private getCurrentWeekUrl: string = `${this.baseUrl}/week/getCurrentWeek`;
  constructor(private http: HttpClient) {}

  getLatestResults(userId: number): Observable<UserResultInfo[]> {
    return this.http.get<UserResultInfo[]>(this.getLatestResultsUrl + userId);
  }

  getCurrentWeekNumber(): Observable<number> {
    return this.http.get<number>(this.getCurrentWeekNumberUrl);
  }

  getCurrentWeek(): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.getCurrentWeekUrl);
  }
}
