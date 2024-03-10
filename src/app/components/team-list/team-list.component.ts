import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { Team, TeamApi } from '../../../../libs/api-client';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [DataViewModule, RatingModule, CommonModule, FormsModule, TagModule, ButtonModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent {
  layout: "list" | "grid" = "list";
  teamList: Team[] = [];
  searchText: string = '';
  filteredabsencesList: Team[] = [];

  constructor(
    private teamApi : TeamApi
  ) { }

  ngOnInit(){
    this.getAllTeams();
  }

  getAllTeams(){
    this.teamApi.apiTeamGet().subscribe((result : any)=>{
      if(result){
      this.teamList=result;
      }
    })
  }
}
