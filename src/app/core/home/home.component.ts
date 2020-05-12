import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logInStatus
      .pipe(takeUntil(this.destroy))
      .subscribe((loggedIn) => {
        if (loggedIn) this.router.navigateByUrl('/results');
      });
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
