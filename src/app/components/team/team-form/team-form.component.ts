import { Component } from '@angular/core';
import { Department, DepartmentApi, TeamApi, TeamRequest } from '../../../../../libs/api-client';
import { RefreshDataService } from '../../../services/refresh-data.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, InputTextModule, DropdownModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css'
})
export class TeamFormComponent {
  visible: boolean = false;
  teamName: string="";
  teamDescription: string="";
  department?: Department;
  departments: Department[]=[];

  ngOnInit() {
    this.getDepartments();
  }

  showDialog() {
    this.visible = true;
  }

  constructor(
    private teamApi: TeamApi,
    private refreshDataService: RefreshDataService,
    private messageService: MessageService,
    private departmentApi: DepartmentApi
  ) { }

  getDepartments(){
    this.departmentApi.apiDepartmentGet().subscribe(result=>{
      this.departments=result;
      this.departments.forEach(element => {
      });
    })
  }

  addNewTeam() {
    const teamReq: TeamRequest={
      teamName: this.teamName,
      teamDescription: this.teamDescription,
      departmentID: this.department?.derpartmentID
    }
    this.teamApi.apiTeamPost({ teamRequest: teamReq}).subscribe(result=>{
      this.refreshDataService.refresh('team-list');
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Position added successfully' });
      this.teamName="";
      this.teamDescription="";
      this.visible=false;
    })
  }
}
