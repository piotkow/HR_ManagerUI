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

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [TableModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, ProgressBarModule, CommonModule, DropdownModule , ButtonModule, InputTextModule, RouterLink, RouterModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {

  teamID: string | null = '';
  teamEmployees: EmployeePositionTeamResponse [] = [];
  loading: boolean = true;
  departments!: any[];

  @ViewChild('dt1') dt1!: Table;

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApi: TeamApi,
    private employeeApi: EmployeeApi
  ){}

  ngOnInit(){
    this.teamID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTeam();
  }

  getTeam(){
    this.employeeApi.apiEmployeeByTeamTeamIdGet({teamId:Number(this.teamID)}).subscribe((employees) => {
      if(employees){
        this.teamEmployees=employees;
        this.departments = this.getUniqueDepartments(employees);
        this.loading = false;
      }
  });
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
