import { Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { TeamListComponent } from './components/team-list/team-list.component';

export const routes: Routes = [
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: '', redirectTo: '/admin-dashboard', pathMatch: 'full' },
  { path: 'hr-dashboard', component: HrDashboardComponent },
  { path: 'team-list', component: TeamListComponent}
];
