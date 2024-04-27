import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CardModule, ImageModule, TagModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  employeeID: string | null = '';
  employee?: EmployeePositionTeamResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeApi: EmployeeApi
  ){}

  ngOnInit(){
    this.employeeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getEmployee();
  }

  getEmployee(){
    this.employeeApi.apiEmployeeIdGet({id:Number(this.employeeID)}).subscribe((employee) => {
      if(employee){
        this.employee=employee;
      }
  });
  }
}
