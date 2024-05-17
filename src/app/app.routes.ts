import { Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { AccountFormComponent } from './components/accounts/account-form/account-form.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { TeamComponent } from './components/team/team.component';



export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard]},
  { path: '*', redirectTo: '/', pathMatch: 'full' },
  { path: 'hr-dashboard', component: HrDashboardComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin']} },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} },
  { path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin']}  },
  { path: '', redirectTo: '/hr-dashboard', pathMatch: 'full' },
  { path: 'team-list', component: TeamListComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin','Employee']} },
  { path: 'team/:id', component: TeamComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin','Employee']} },
  { path: 'employee/:id', component: EmployeeComponent, canActivate: [AuthGuard] , data: {roles: ['HR', 'Admin']}},
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] , data: {roles: ['HR', 'Admin', 'Employee']}},
  { path: 'employee-list', component: EmployeeListComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin']},
  children:[
    {path: 'detail/:id', component: EmployeeCardComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin']} },
  ]
  },
  { path: 'employee-list/new', component: AccountFormComponent, canActivate: [AuthGuard], data: {roles: ['HR', 'Admin']} }
];
