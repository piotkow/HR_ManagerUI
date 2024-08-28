import { Component, ViewChild } from '@angular/core';
import { Department, DepartmentApi, EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
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
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { url } from 'inspector';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [TableModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, ProgressBarModule, CommonModule, DropdownModule , ButtonModule, InputTextModule, RouterLink, RouterModule, AvatarModule, ConfirmDialogModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {


    employees!: EmployeePositionTeamResponse[];
    transformedEmployees!: any[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];
    departments!: Department[];
    showEmployeeCard: boolean = false;

    constructor(
      private employeeApi : EmployeeApi,
      private router : Router,
      private departmentApi: DepartmentApi
      ) {}

    ngOnInit() {
      this.getAllEmployees();
    }

    @ViewChild('dt1') dt1!: Table;

    onInputChange(event: Event, table : Table) {
      const target = event.target as HTMLInputElement;
      if (target instanceof HTMLInputElement) {
        table.filterGlobal(target.value, 'contains');
      }
    }

    private getUniqueDepartments() {
      this.departmentApi.apiDepartmentGet().subscribe(result=>{
        this.departments=result;
      })
    }

    clear(table: Table) {
        table.clear();
    }

getAllEmployees() {
  this.employeeApi.apiEmployeeGet().subscribe((employees) => {
    this.employees = employees;
    this.transformedEmployees = employees.map(employee => ({
      ...employee,
      dateOfEmployment: employee.dateOfEmployment ? new Date(employee.dateOfEmployment) : null
    }));
    this.getUniqueDepartments();
    this.loading = false;
  });
}


    navigateToEmployeeDetail(employeeId: number) {
      this.router.navigateByUrl(`employee/${{employeeId}}`);
    }

}
