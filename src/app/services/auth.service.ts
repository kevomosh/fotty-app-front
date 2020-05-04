import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginInfo } from '../interfaces/LoginInfo';
import { RegisterInfo } from '../interfaces/registerInfo';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private baseUrl = environment.apiEndpoint;
  private logInUrl: string = `${this.baseUrl}/auth/login`;
  private registerUrl: string = `${this.baseUrl}/auth/register`;

  private loginStatus$ = new BehaviorSubject<boolean>(this.checkLogInStatus());
  private userName$ = new BehaviorSubject<string>(
    localStorage.getItem('userName')
  );

  private userRole$ = new BehaviorSubject<string>(
    localStorage.getItem('userRole')
  );

  private jwt$ = new BehaviorSubject<string>(localStorage.getItem('userName'));

  private userId$ = new BehaviorSubject<number>(
    parseInt(localStorage.getItem('userId'))
  );

  register(registerInfo: RegisterInfo): Observable<any> {
    return this.http.post<any>(this.registerUrl, registerInfo);
  }

  login(loginInfo: LoginInfo): Observable<any> {
    return this.http.post<any>(this.logInUrl, loginInfo).pipe(
      map((result) => {
        if (result && result.token) {
          const decodedToken = jwt_decode(result.token);
          const id = decodedToken.id;
          const role = result.authorities[0].authority;
          const name = result.username;

          localStorage.setItem('jwt', result.token);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('userId', id);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', name);

          this.loginStatus$.next(this.checkLogInStatus());
          this.userId$.next(parseInt(localStorage.getItem('userId')));
          this.userName$.next(localStorage.getItem('userName'));
          this.userRole$.next(localStorage.getItem('userRole'));
          this.jwt$.next(localStorage.getItem('jwt'));
        }
        return result;
      }),
      shareReplay()
    );
  }

  logout() {
    this.loginStatus$.next(false);
    localStorage.removeItem('jwt');
    localStorage.setItem('loginStatus', '0');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigateByUrl('/login');
  }

  get logInStatus(): Observable<boolean> {
    return this.loginStatus$.asObservable();
  }

  get userName(): Observable<string> {
    return this.userName$.asObservable();
  }

  get userId(): Observable<number> {
    return this.userId$.asObservable();
  }

  get userRole(): Observable<string> {
    return this.userRole$.asObservable();
  }

  get userJwt(): Observable<string> {
    return this.jwt$.asObservable();
  }

  checkLogInStatus(): boolean {
    const cookie = localStorage.getItem('loginStatus');

    if (cookie === '1') {
      if (
        localStorage.getItem('jwt') === null ||
        localStorage.getItem('jwt') === undefined
      ) {
        return false;
      }

      const token = localStorage.getItem('jwt');
      const decoded = jwt_decode(token);

      if (decoded.exp === undefined) {
        return false;
      }

      const date = new Date(0);
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }

      return false;
    }
    return false;
  }
}
