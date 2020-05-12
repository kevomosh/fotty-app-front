import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GroupInfo } from '../interfaces/groupInfo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  private baseUrl = environment.apiEndpoint;
  private changeGroupsUrl = `${this.baseUrl}/account/changeGroups/`;

  changeGroups(newGroups: any): Observable<GroupInfo[]> {
    return this.authService.userId.pipe(
      switchMap((userId) =>
        this.http.post<GroupInfo[]>(this.changeGroupsUrl + userId, newGroups)
      ),
      tap((groups) => this.authService.modifyGroups(groups))
    );
  }
}
