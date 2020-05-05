import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PickInfo } from '../interfaces/pickInfo';

@Injectable({
  providedIn: 'root',
})
export class PickService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiEndpoint;
  private createOrUpdateUrl = `${this.baseUrl}/pick/createOrUpdatePick`;

  createOrUpdatePick(pickInfo: PickInfo): Observable<any> {
    return this.http.post<any>(this.createOrUpdateUrl, pickInfo);
  }
}
