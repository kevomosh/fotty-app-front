import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AccessDeniedComponent,
    ForgotPasswordComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  imports: [SharedModule, RouterModule.forChild([])],
  exports: [NavbarComponent],
})
export class CoreModule {}
