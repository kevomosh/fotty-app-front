import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { ChangeGroupComponent } from './components/change-group/change-group.component';
import { MakePickComponent } from './components/make-pick/make-pick.component';
import { ErrorComponent } from './components/picks/error/error.component';
import { PicksComponent } from './components/picks/picks.component';
import { TableHeadComponent } from './components/picks/table-head/table-head.component';
import { TableComponent } from './components/picks/table/table.component';
import { ResultsComponent } from './components/results/results.component';

@NgModule({
  declarations: [
    ResultsComponent,
    PicksComponent,
    MakePickComponent,
    ChangeGroupComponent,
    ErrorComponent,
    TableHeadComponent,
    TableComponent,
  ],
  imports: [
    SharedModule,
    NgxDatatableModule,
    RouterModule.forChild([
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
        path: 'change-group',
        component: ChangeGroupComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
      },
    ]),
  ],
})
export class AllMembersModule {}
