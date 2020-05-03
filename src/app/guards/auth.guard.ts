import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.logInStatus.pipe(
      map((logInStatus) => {
        if (!logInStatus) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
        this.authService.userRole.pipe(
          map((userRole) => {
            const roles = activatedRoute.data.roles as Array<string>;
            const allowed: boolean = roles.includes(userRole);
            if (!allowed) {
              this.router.navigate(['/access-denied']);
            }

            return allowed;
          })
        );
      })
    );
  }
}
