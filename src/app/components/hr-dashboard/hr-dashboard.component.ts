import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AbsenceApi, AbsencesEmployeeResponse } from '../../../../libs/api-client';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Status } from '../../../../libs/api-client';
import { TagModule } from 'primeng/tag';
import { TabView, TabViewModule } from 'primeng/tabview';
import { EmployeeDashboardComponent } from '../employee-dashboard/employee-dashboard.component';
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../services/refresh-data.service';
import { DragDropModule } from 'primeng/dragdrop';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule, TabViewModule, EmployeeDashboardComponent, DragDropModule, PanelModule, CommonModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent {
  absencesList: AbsencesEmployeeResponse[] = [];
  searchText: string = '';
  pendingAbsences: AbsencesEmployeeResponse[] = [];
  approvedAbsences: AbsencesEmployeeResponse[] = [];
  rejectedAbsences: AbsencesEmployeeResponse[] = [];
  private subscription: Subscription = new Subscription();
  status = Status;
  draggedAbsence: AbsencesEmployeeResponse | undefined | null;

  constructor(
    private absenceApi: AbsenceApi,
    private refreshDataService: RefreshDataService
  ) { }

  ngOnInit() {
    this.getAllAbsences();
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'absence-status-change') {
        this.getAllAbsences();
      }
    }))
  }

  getAllAbsences() {
    this.absenceApi.apiAbsenceGet().subscribe((result: any) => {
      if (result) {
        this.absencesList = result;
        this.pendingAbsences = this.absencesList.filter(item => item.status?.toString() === "Pending");
        this.approvedAbsences = this.absencesList.filter(item => item.status?.toString() === "Approved");
        this.rejectedAbsences = this.absencesList.filter(item => item.status?.toString() === "Rejected")
      }
    })
  }

  changeAbsenceStatus(absenceId: number | undefined, status: string) {
    console.log('status', status);
    if (absenceId)
      this.absenceApi.apiAbsenceUpdateStatusIdPut({ id: absenceId, body: '"' + status + '"' }).subscribe({
        next: (result) => {
          this.getAllAbsences();
          console.log("result", result);
        },
        error: (err) => {
          console.log(err.error);
        }
      })
  }

  dragStart(absence: AbsencesEmployeeResponse) {
    this.draggedAbsence = absence;
  }

  dragEnd() {
    this.draggedAbsence = null;
  }

  dropOnApprove(){
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Approved')
  }

  dropOnReject(){
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Rejected')
  }

  dropOnPending(){
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Pending')
  }

}
