import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './test/admin/admin.component';
import { UserComponent } from './test/user/user.component';
import { MakePickComponent } from './user/make-pick/make-pick.component';
import { PicksComponent } from './user/picks/picks.component';
import { ResultsComponent } from './user/results/results.component';

const routes: Routes = [
  {
    path: 'picks/:weekNumber',
    component: PicksComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  {
    path: 'results',
    component: ResultsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  {
    path: 'make-pick',
    component: MakePickComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
