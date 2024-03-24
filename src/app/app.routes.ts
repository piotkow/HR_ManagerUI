import { Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';

export const routes: Routes = [
  { path: 'hr-dashboard', component: HrDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: '', redirectTo: '/hr-dashboard', pathMatch: 'full' },
  { path: 'team-list', component: TeamListComponent},
  { path: 'calendar', component: CalendarComponent},
  { path: 'employee-list', component: EmployeeListComponent,
  children:[
    {path: 'detail/:id', component: EmployeeCardComponent}
  ]
  },
  { path: 'calendar', component: CalendarComponent }
];
