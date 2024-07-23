import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeRequest } from '../../../../libs/api-client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CheckboxModule, CommonModule, FormsModule],
  templateUrl: './employees-dialog.component.html',
  styleUrl: './employees-dialog.component.css'
})
export class EmployeesDialogComponent {
  visible: boolean = false;
  @Input() teamId? : string | null;

  selectedEmployees: EmployeePositionTeamResponse[] = [];

  employees!: EmployeePositionTeamResponse[];
  departments!: any[];
  
  ngOnInit() {
    this.getAllEmployees();
  }

  showDialog() {
      this.visible = true;
  }

  constructor(
    private employeeApi : EmployeeApi,
    private router : Router
    ) {}

  getAllEmployees(){
    this.employeeApi.apiEmployeeGet().subscribe((employees) => {
      this.employees = employees;
      this.departments = this.getUniqueDepartments(employees);
  });
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

  addNewTeamMember(){
    for(var item of this.selectedEmployees){
    this.employeeApi.apiEmployeeIdPut({id:Number(item.employeeID), employeeRequest: this.mapEmployeeResponseToRequest(item)}).subscribe((result)=>{
      if(result){
        Swal.fire('Success', 'You have successfully added new team member', 'success').then(swalResult=>{
          if(swalResult) window.location.reload();
        })
      }
    })
    this.visible = false;
    }
  }

  getFormattedLabel(item: any): string {
    return `${item.firstName} ${item.lastName} - Email: [${item.email}] \n Current team: ${item.teamName}`;
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
