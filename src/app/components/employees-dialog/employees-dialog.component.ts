import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DepartmentApi, EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeRequest } from '../../../../libs/api-client';
import Swal from 'sweetalert2';
import { InputTextModule } from 'primeng/inputtext';
import { filter } from 'rxjs';

@Component({
  selector: 'app-employees-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CheckboxModule, CommonModule, FormsModule, InputTextModule],
  templateUrl: './employees-dialog.component.html',
  styleUrl: './employees-dialog.component.css'
})
export class EmployeesDialogComponent {
  visible: boolean = false;
  @Input() teamId?: string | null;

  selectedEmployees: EmployeePositionTeamResponse[] = [];
  employees!: EmployeePositionTeamResponse[];
  filteredEmployees!: EmployeePositionTeamResponse[];
  searchTerm: string = '';
  departments!: any[];

  ngOnInit() {
    this.getAllEmployees();
  }

  showDialog() {
    this.visible = true;
  }

  constructor(
    private employeeApi: EmployeeApi,
    private router: Router,
    private departmentApi: DepartmentApi
  ) { }


  onSearchChange() {
    if (this.employees) {
      this.filteredEmployees = this.employees.filter(employee =>
        (employee.firstName + ' ' + employee.lastName).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getAllEmployees() {
    this.employeeApi.apiEmployeeGet().subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees = employees;
      this.getUniqueDepartments();
    });
  }

  private getUniqueDepartments() {
    this.departmentApi.apiDepartmentGet().subscribe(result => {
      this.departments = result;
    })
  }

  addNewTeamMember() {
    for (var item of this.selectedEmployees) {
      this.employeeApi.apiEmployeeIdPut({ id: Number(item.employeeID), employeeRequest: this.mapEmployeeResponseToRequest(item) }).subscribe((result) => {
        if (result) {
          Swal.fire('Success', 'You have successfully added a new team member', 'success').then(swalResult => {
            if (swalResult) window.location.reload();
          })
        }
      })
      this.visible = false;
    }
  }

  mapEmployeeResponseToRequest(employeeRes: EmployeePositionTeamResponse): EmployeeRequest {
    const employeeReq: EmployeeRequest = {
      firstName: employeeRes.firstName,
      lastName: employeeRes.lastName,
      email: employeeRes.email,
      phone: employeeRes.phone,
      country: employeeRes.country,
      city: employeeRes.city,
      street: employeeRes.street,
      postalCode: employeeRes.postalCode,
      dateOfEmployment: employeeRes.dateOfEmployment,
      positionID: employeeRes.positionID,
      teamID: Number(this.teamId)
    };
    return employeeReq;
  }



}
