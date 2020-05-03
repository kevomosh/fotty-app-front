import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GroupInfo } from '../interfaces/groupInfo';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiEndpoint;
  private getAllGroupsUrl: string = `${this.baseUrl}/group/allGroups`;

  getAllGroups(): Observable<GroupInfo[]> {
    return this.http.get<GroupInfo[]>(this.getAllGroupsUrl);
  }
}
