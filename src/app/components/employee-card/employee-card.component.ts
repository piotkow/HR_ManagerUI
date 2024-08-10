import { Component } from '@angular/core';
import { AccountApi, EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CardModule, AvatarModule, ButtonModule, RouterLink, ConfirmDialogModule, ToastModule],
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
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accountApi: AccountApi
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

  deleteEmployee(){
    if(this.employeeID){
    this.employeeApi.apiEmployeeIdDelete({id: Number(this.employeeID)}).subscribe({
      next:(result)=>{
        console.log("result z usuwania employee:", result);
      }
    })
    }
  }

  confirmDialog() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteEmployee();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
}
