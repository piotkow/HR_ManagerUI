import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { AbsenceApi, AbsencesEmployeeResponse, AccountEmployeeResponse, Status } from '../../../../libs/api-client';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-absence-request-list',
  standalone: true,
  imports: [DataViewModule, TagModule, ButtonModule, CommonModule, ConfirmDialogModule, ToastModule, TableModule],
  templateUrl: './absence-request-list.component.html',
  styleUrl: './absence-request-list.component.css'
})
export class AbsenceRequestListComponent {

  absences: AbsencesEmployeeResponse[] = [];
  private subscription: Subscription = new Subscription()
  user: AccountEmployeeResponse;
  constructor(
    private absenceApi: AbsenceApi,
    private storageService: StorageService,
    private refreshDataService: RefreshDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.user = this.storageService.get('user');
   }

  ngOnInit() {
    this.user = this.storageService.get('user');
    this.getAbsencesByEmployee(this.user.employeeID);
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'absence-request-list') {
        this.getAbsencesByEmployee(this.user.employeeID);
      }
    }))
  }

  getAbsencesByEmployee(empId: number | undefined) {
    if (empId) {
      this.absenceApi.apiAbsenceByEmployeeGet({ employeeId: empId }).subscribe({
        next:(res)=>{
          this.absences = res;
          console.log("nowa lista: ", this.absences);
        },
        error: (err)=>{

        }
      })
    }
  }

  deleteAbsence(absenceId: number | undefined) {
    if (absenceId) {
      this.absenceApi.apiAbsenceIdDelete({ id: absenceId }).subscribe({
        next: (res) => {
          this.getAbsencesByEmployee(this.user.employeeID);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  confirmDialog(absenceId: number | undefined) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteAbsence(absenceId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}
