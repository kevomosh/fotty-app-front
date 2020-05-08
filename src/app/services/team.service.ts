import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamInfo } from '../interfaces/teamInfo';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private baseUrl = environment.apiEndpoint;
  private getAllteamsUrl: string = `${this.baseUrl}/team/all`;
  constructor(private http: HttpClient) {}

  getAllteams(): Observable<TeamInfo[]> {
    return this.http.get<TeamInfo[]>(this.getAllteamsUrl);
  }
}
