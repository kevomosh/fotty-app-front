import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
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
  private getToTalNumberOfWeeksUrl: string = `${this.baseUrl}/week/total`;
  private createWNewWeekUrl: string = `${this.baseUrl}/week/createNewWeek`;
  private filteredMatchesUrl: string = `${this.baseUrl}/week/filteredMatchesToBePlayed`;
  private getWeekByWeekNumberUrl: string = `${this.baseUrl}/week/getWeekByWeekNumber/`;
  private addResultsUpdateScoreUrl: string = `${this.baseUrl}/week/addResultsUpdateScore`;

  constructor(private http: HttpClient) {}

  private weekNumber$: ReplaySubject<number> = new ReplaySubject(1);

  getLatestResults(userId: number): Observable<UserResultInfo[]> {
    return this.http.get<UserResultInfo[]>(this.getLatestResultsUrl + userId);
  }

  get weekNumber(): Observable<number> {
    return this.weekNumber$.asObservable();
  }

  getCurrentWeekNumber(): Observable<number> {
    return this.http.get<number>(this.getCurrentWeekNumberUrl);
  }

  getFilteredMatches(): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.filteredMatchesUrl);
  }
  createNewWeek(weekInfo: any): Observable<WeekInfo> {
    return this.http.post<WeekInfo>(this.createWNewWeekUrl, weekInfo);
  }

  getCurrentWeek(): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.getCurrentWeekUrl);
  }

  getWeekByWeekNumber(weekNumber: number): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.getWeekByWeekNumberUrl + weekNumber);
  }

  getTotalNumberOfWeeks(): Observable<number> {
    return this.http.get<number>(this.getToTalNumberOfWeeksUrl);
  }

  addResultsUpdateScore(weekinfo: WeekInfo): Observable<any> {
    return this.http.post<any>(this.addResultsUpdateScoreUrl, weekinfo);
  }
}
