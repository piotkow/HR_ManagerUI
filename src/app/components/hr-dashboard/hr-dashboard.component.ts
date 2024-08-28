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
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarDialogComponent } from "../calendar-dialog/calendar-dialog.component";

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule, TabViewModule, EmployeeDashboardComponent, DragDropModule, PanelModule, CommonModule, ConfirmPopupModule, CalendarDialogComponent],
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
  calendarDialogVisible: boolean= false;
  teamIdToShowOnDialog?: number;

  constructor(
    private absenceApi: AbsenceApi,
    private refreshDataService: RefreshDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getAllAbsences();
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'absence-status-change') {
        this.getAllAbsences();
      }
    }))
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'hide-calendar-dialog') {
        this.calendarDialogVisible=false;
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

  onButtonClick(event: Event, absenceId: number | undefined, status: string) {
    this.changeAbsenceStatus(absenceId, status);
    event.stopPropagation();
  }

  changeAbsenceStatus(absenceId: number | undefined, status: string) {
    if (absenceId)
      this.absenceApi.apiAbsenceUpdateStatusIdPut({ id: absenceId, body: '"' + status + '"' }).subscribe({
        next: (result) => {
          this.getAllAbsences();
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

  dropOnApprove() {
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Approved')
  }

  dropOnReject() {
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Rejected')
  }

  dropOnPending() {
    this.changeAbsenceStatus(this.draggedAbsence?.absenceId, 'Pending')
  }

  showTeamCalendar(event: Event, teamId: number | undefined) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Open Team Calendar?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamIdToShowOnDialog= teamId;
        this.calendarDialogVisible=true;
        setTimeout(()=>{
          this.refreshDataService.refresh('init-calendar');
        },200);
      },
      reject: () => { }
    });
  }

}
