import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AddGamesComponent } from './add-games/add-games.component';
import { PostResultsComponent } from './post-results/post-results.component';

@NgModule({
  declarations: [AddGamesComponent, PostResultsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'admin/postResults',
        component: PostResultsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },

      {
        path: 'admin/addGames',
        component: AddGamesComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
    ]),
  ],
})
export class AdminModule {}
