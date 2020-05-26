import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logInStatus$ = this.authService.logInStatus.pipe(
    tap((loggedIn) => {
      if (loggedIn) this.router.navigateByUrl('/results');
    })
  );
}
