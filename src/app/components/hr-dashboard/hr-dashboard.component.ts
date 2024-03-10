import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AbsenceApi, AbsencesEmployeeResponse } from '../../../../libs/api-client';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent {
  absencesList: AbsencesEmployeeResponse[] = [];
  searchText: string = '';
  filteredabsencesList: AbsencesEmployeeResponse[] = [];

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
      }
    })
  }
}
