import { Component, ViewChild } from '@angular/core';
import { EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { TableModule, Table } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
// import { url } from 'inspector';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [TableModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, ProgressBarModule, CommonModule, DropdownModule , ButtonModule, InputTextModule, RouterLink, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {


    employees!: EmployeePositionTeamResponse[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];
    departments!: any[];
    showEmployeeCard: boolean = false;

    constructor(
      private employeeApi : EmployeeApi,
      private router : Router
      ) {}

    ngOnInit() {
      this.getAllEmployees();
      console.log(this.departments);
    }

    @ViewChild('dt1') dt1!: Table;

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

    clear(table: Table) {
        table.clear();
    }

    getAllEmployees(){
      this.employeeApi.apiEmployeeGet().subscribe((employees) => {
        this.employees = employees;
        this.departments = this.getUniqueDepartments(employees);
        this.loading = false;
    });
    }

    navigateToEmployeeDetail(employeeId: number) {
      console.log("id w funckji: ", employeeId);
      this.router.navigateByUrl(`employee/${{employeeId}}`);
    }

}
