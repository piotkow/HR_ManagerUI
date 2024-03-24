import { Component } from '@angular/core';
import { EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  employeeID: string | null = '';
  employee?: EmployeePositionTeamResponse;

  constructor(
    private employeeApi: EmployeeApi,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(){
    this.employeeID= this.activatedRoute.snapshot.paramMap.get('id');
    this.getEmployee();
    Number(this.employeeID);
  }

  getEmployee(){
    this.employeeApi.apiEmployeeIdGet({id:Number(this.employeeID)}).subscribe((employee) => {
      if(employee){
        this.employee=employee;
      }
  });
  }
}
