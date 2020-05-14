import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
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
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
