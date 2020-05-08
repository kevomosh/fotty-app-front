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
} from '@ng-bootstrap/ng-bootstrap';
import { AddGamesComponent } from './admin/add-games/add-games.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { LoginComponent } from './core/login/login.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { FilterComponent } from './helper/filter/filter.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { AdminComponent } from './test/admin/admin.component';
import { UserComponent } from './test/user/user.component';
import { MakePickComponent } from './user/make-pick/make-pick.component';
import { PicksComponent } from './user/picks/picks.component';
import { ResultsComponent } from './user/results/results.component';
import { PostResultsComponent } from './admin/post-results/post-results.component';

const bootStrapModules = [
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbButtonsModule,
  NgbDatepickerModule,
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
