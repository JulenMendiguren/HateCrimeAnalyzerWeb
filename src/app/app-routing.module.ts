import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { ColectivesComponent } from './components/colectives/colectives.component';
import { MinAdminGuard } from './services/guards/min-admin.guard';
import { MinResearcherGuard } from './services/guards/min-researcher.guard';
import { MinColaboratorGuard } from './services/guards/min-colaborator.guard';
import { ReportQComponent } from './components/report-q/report-q.component';
import { UserQComponent } from './components/user-q/user-q.component';
import { IncidentsComponent } from './components/incidents/incidents.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [MinAdminGuard],
    pathMatch: 'full',
  },
  {
    path: 'colectives',
    component: ColectivesComponent,
    canActivate: [MinResearcherGuard],
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'questionnaire/report',
    component: ReportQComponent,
    canActivate: [MinResearcherGuard],
    pathMatch: 'full',
  },
  {
    path: 'questionnaire/user',
    component: UserQComponent,
    canActivate: [MinResearcherGuard],
    pathMatch: 'full',
  },
  {
    path: 'incidents',
    component: IncidentsComponent,
    canActivate: [MinColaboratorGuard],
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
