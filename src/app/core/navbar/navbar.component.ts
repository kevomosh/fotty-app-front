import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuCollapsed = true;

  combined$ = combineLatest([
    this.authService.logInStatus,
    this.authService.userName,
    this.authService.userRole,
  ]).pipe(
    map(([isLoggedIn, userName, userRole]) => ({
      isLoggedIn,
      userName,
      userRole,
    }))
  );

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
