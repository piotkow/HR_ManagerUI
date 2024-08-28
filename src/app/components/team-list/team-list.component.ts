import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { AccountEmployeeResponse, Team, TeamApi, TeamDepartmentResponse } from '../../../../libs/api-client';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TeamFormComponent } from "../team/team-form/team-form.component";
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../services/refresh-data.service';
import { StorageService } from '../../services/storage.service';



@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [DataViewModule, RatingModule, CommonModule, TagModule, ButtonModule, RouterLink, TeamFormComponent],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent {
  layout: "list" | "grid" = "list";
  teamList: TeamDepartmentResponse[] = [];
  searchText: string = '';
  filteredabsencesList: Team[] = [];
  private subscription: Subscription = new Subscription();
  loggedUser?: AccountEmployeeResponse;

  constructor(
    private teamApi : TeamApi,
    private refreshDataService: RefreshDataService,
    private storageService: StorageService
  ) { }

  ngOnInit(){
    this.loggedUser = this.storageService.get('user');
    this.getAllTeams();
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'team-list') {
        this.getAllTeams();
      }
    }))
  }

  getAllTeams(){
    this.teamApi.apiTeamGet().subscribe((result : TeamDepartmentResponse[])=>{
      if(result){
      this.teamList=result;
      }
    })
  }
}
