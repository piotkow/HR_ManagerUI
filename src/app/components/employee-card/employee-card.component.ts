import { Component } from '@angular/core';
import { EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CardModule, AvatarModule, ButtonModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  employeeID: string | null = '';
  employee?: EmployeePositionTeamResponse;
  routerSubscription?: Subscription;

  constructor(
    private employeeApi: EmployeeApi,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ){}

  
  ngOnInit(): void {
    this.employeeID= this.activatedRoute.snapshot.paramMap.get('id');
    this.getEmployee();
    Number(this.employeeID);
    this.router.events.subscribe(eventResult => {
      if (eventResult instanceof NavigationEnd) {
        this.employeeID = this.activatedRoute.snapshot.paramMap.get('id');
        this.getEmployee();
      }
    })
  }

  getEmployee(){
    this.employeeApi.apiEmployeeIdGet({id:Number(this.employeeID)}).subscribe((employee) => {
      if(employee){
        this.employee=employee;
      }
  });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
