import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { ColectivesComponent } from './components/colectives/colectives.component';
import { QuestComponent } from './components/quest/quest.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
    pathMatch: 'full',
  },
  {
    path: 'colectives',
    component: ColectivesComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'quest',
    component: QuestComponent,
    pathMatch: 'full',
  },
  {
    path: 'reports',
    component: ReportsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
