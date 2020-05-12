import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuCollapsed = true;

  combined$ = combineLatest([
    this.authService.logInStatus,
    this.authService.userName,
    this.authService.userRole,
    this.weekService.weekNumber,
  ]).pipe(
    map(([isLoggedIn, userName, userRole, weekNumber]) => ({
      isLoggedIn,
      userName,
      userRole,
      weekNumber,
    }))
  );

  constructor(
    private authService: AuthService,
    private weekService: WeekService
  ) {}

  onLogout() {
    this.authService.logout();
  }
}
