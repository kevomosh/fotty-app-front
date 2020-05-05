import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgbAlertModule,
  NgbButtonsModule,
  NgbCollapseModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { LoginComponent } from './core/login/login.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { AdminComponent } from './test/admin/admin.component';
import { UserComponent } from './test/user/user.component';
import { MakePickComponent } from './user/make-pick/make-pick.component';
import { ResultsComponent } from './user/results/results.component';
import { PicksComponent } from './user/picks/picks.component';

const bootStrapModules = [
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbButtonsModule,
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
