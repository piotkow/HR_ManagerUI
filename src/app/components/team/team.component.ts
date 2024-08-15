import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AccountEmployeeResponse, Department, DepartmentApi, EmployeeApi, EmployeePositionTeamResponse, Team, TeamApi, TeamDepartmentResponse } from '../../../../libs/api-client';
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
import { StorageService } from '../../services/storage.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-team',
    standalone: true,
    templateUrl: './team.component.html',
    styleUrl: './team.component.css',
    imports: [TableModule,ConfirmDialogModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, ProgressBarModule, CommonModule, DropdownModule, ButtonModule, InputTextModule, RouterLink, RouterModule, EmployeesDialogComponent, AvatarModule]
})
export class TeamComponent {

  teamID: string | null = '';
  teamEmployees: EmployeePositionTeamResponse [] = [];
  loading: boolean = true;
  departments!: Department[];
  team?: TeamDepartmentResponse;
  user?: AccountEmployeeResponse;

  @ViewChild('dt1') dt1!: Table;

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApi: TeamApi,
    private employeeApi: EmployeeApi,
    private storageService: StorageService,
    private departmentApi: DepartmentApi,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ){}

  ngOnInit(){
    this.user = this.storageService.get('user');
    this.teamID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTeam();
    this.getEmployees();
  }

  getEmployees(){
    this.employeeApi.apiEmployeeByTeamTeamIdGet({teamId:Number(this.teamID)}).subscribe((employees) => {
      if(employees){
        this.teamEmployees=employees;
        this.getUniqueDepartments();
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

private getUniqueDepartments() {
  this.departmentApi.apiDepartmentGet().subscribe(result=>{
    this.departments=result;
  })
}

deleteTeam(teamId: number | undefined) {
  if(teamId)
  this.teamApi.apiTeamIdDelete({ id: Number(teamId) }).subscribe({
    next: (res) => {
      this.router.navigateByUrl('team-list');
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted' });
    },
    error: (err)=>{
      console.log("error while delete team:", err);
    }
  })
}

confirmDialog(teamId: number | undefined) {
  this.confirmationService.confirm({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptButtonStyleClass: "p-button-danger p-button-text",
    rejectButtonStyleClass: "p-button-text p-button-text",
    acceptIcon: "none",
    rejectIcon: "none",

    accept: () => {
      this.deleteTeam(teamId);
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    }
  });
}

}
