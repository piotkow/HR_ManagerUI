import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { EmployeeApi, EmployeePositionTeamResponse, Team, TeamApi } from '../../../../libs/api-client';
import { Table, TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeesDialogComponent } from "../employees-dialog/employees-dialog.component";
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-team',
    standalone: true,
    templateUrl: './team.component.html',
    styleUrl: './team.component.css',
    imports: [TableModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, ProgressBarModule, CommonModule, DropdownModule, ButtonModule, InputTextModule, RouterLink, RouterModule, EmployeesDialogComponent, AvatarModule]
})
export class TeamComponent {

  teamID: string | null = '';
  teamEmployees: EmployeePositionTeamResponse [] = [];
  loading: boolean = true;
  departments!: any[];
  team?: Team;

  @ViewChild('dt1') dt1!: Table;

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApi: TeamApi,
    private employeeApi: EmployeeApi
  ){}

  ngOnInit(){
    this.teamID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTeam();
    this.getEmployees();
  }

  getEmployees(){
    this.employeeApi.apiEmployeeByTeamTeamIdGet({teamId:Number(this.teamID)}).subscribe((employees) => {
      if(employees){
        this.teamEmployees=employees;
        this.departments = this.getUniqueDepartments(employees);
        this.loading = false;
      }
  });
  }

  getTeam(){
    this.teamApi.apiTeamIdGet({id:Number(this.teamID)}).subscribe((team) =>{
      if(team){
        this.team=team;
      }
    })
  }

  clear(table: Table) {
    table.clear();
}

onInputChange(event: Event, table : Table) {
  const target = event.target as HTMLInputElement;
  if (target instanceof HTMLInputElement) {
    table.filterGlobal(target.value, 'contains');
  }
}

private getUniqueDepartments(employees: EmployeePositionTeamResponse[]): string[] {
  const departmentSet = new Set<string>();
  employees.forEach((employee) => {
    if(employee.department){
      departmentSet.add(employee.department);
    }
  });
  return Array.from(departmentSet);
}


}
