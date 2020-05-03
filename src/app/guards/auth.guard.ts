import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
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
    return combineLatest([
      this.authService.logInStatus,
      this.authService.userRole,
    ]).pipe(
      map(([logInStatus, userRole]) => {
        if (!logInStatus) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        const roles = activatedRoute.data.roles as Array<string>;

        const allowed: boolean = roles.includes(userRole);
        if (!allowed) {
          this.router.navigate(['/access-denied']);
        }

        return allowed;
      })
    );
  }
}
