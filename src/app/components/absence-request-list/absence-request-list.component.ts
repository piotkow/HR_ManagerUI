import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { AbsenceApi, AbsencesEmployeeResponse, AccountEmployeeResponse, Status } from '../../../../libs/api-client';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-absence-request-list',
  standalone: true,
  imports: [DataViewModule, TagModule, ButtonModule, CommonModule],
  templateUrl: './absence-request-list.component.html',
  styleUrl: './absence-request-list.component.css'
})
export class AbsenceRequestListComponent {

  absences: AbsencesEmployeeResponse[]= [];
  subscription: Subscription= new Subscription();
  constructor(
    private absenceApi: AbsenceApi,
    private storageService: StorageService,
    private refreshDataService: RefreshDataService
  ){}

  ngOnInit(){
    const user : AccountEmployeeResponse=this.storageService.get('user');
    this.getAbsencesByEmployee(user.employeeID);
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index)=>{
      if (index==='absence-request-list'){
        this.getAbsencesByEmployee(user.employeeID);
      }
    }))
  }

  getAbsencesByEmployee(employeeId: number | undefined){
    if (employeeId){
      this.absenceApi.apiAbsenceByEmployeeGet({employeeId: employeeId}).subscribe({
        next: (res)=>{
          this.absences=res;
          console.log(res, this.absences);
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }
  }

  deleteAbsence(absenceId: number){
    this.absenceApi.apiAbsenceIdDelete({id: absenceId}).subscribe({
      next:(res)=>{
        this.refreshDataService.refresh('absence-request-list');
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
