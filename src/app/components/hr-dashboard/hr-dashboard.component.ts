import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AbsenceApi, AbsencesEmployeeResponse } from '../../../../libs/api-client';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Status } from '../../../../libs/api-client';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent {
  absencesList: AbsencesEmployeeResponse[] = [];
  searchText: string = '';
  pendingAbsences: AbsencesEmployeeResponse[] = [];
  approvedAbsences: AbsencesEmployeeResponse[] = [];
  rejectedAbsences: AbsencesEmployeeResponse[] = [];

  constructor(
    private absenceApi : AbsenceApi
  ) { }

  ngOnInit(){
    this.getAllAbsences();
  }

  getAllAbsences(){
    this.absenceApi.apiAbsenceGet().subscribe((result : any)=>{
      if(result){
      this.absencesList=result;
      this.pendingAbsences=this.absencesList.filter(item => item.status?.toString()==="Pending");
      this.approvedAbsences=this.absencesList.filter(item => item.status?.toString()==="Approved");
      this.rejectedAbsences=this.absencesList.filter(item => item.status?.toString()==="Rejected")
      }
    })
  }
}
