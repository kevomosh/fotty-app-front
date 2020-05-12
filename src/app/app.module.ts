import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgbAlertModule,
  NgbButtonsModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AddGamesComponent } from './admin/add-games/add-games.component';
import { PostResultsComponent } from './admin/post-results/post-results.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { LoginComponent } from './core/login/login.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { FilterComponent } from './helper/filter/filter.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { AdminComponent } from './test/admin/admin.component';
import { UserComponent } from './test/user/user.component';
import { MakePickComponent } from './user/make-pick/make-pick.component';
import { PicksComponent } from './user/picks/picks.component';
import { ResultsComponent } from './user/results/results.component';
import { HomeComponent } from './core/home/home.component';
import { ChangeGroupComponent } from './user/change-group/change-group.component';

const bootStrapModules = [
  NgbModule,
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbButtonsModule,
  NgbDatepickerModule,
  NgbPaginationModule,
];
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    AccessDeniedComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ResultsComponent,
    MakePickComponent,
    PicksComponent,
    FilterComponent,
    AddGamesComponent,
    PostResultsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    ChangeGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    bootStrapModules,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
