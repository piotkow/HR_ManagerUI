import { Component, ViewChild } from '@angular/core';
import { Department, DepartmentApi } from '../../../../libs/api-client';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AddDepartmentDialogComponent } from "../add-department-dialog/add-department-dialog.component";
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../services/refresh-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, InputTextModule, AddDepartmentDialogComponent],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {
  departments!: Department[];
  @ViewChild('dt1') dt1!: Table;
  private subscription: Subscription = new Subscription()

  constructor(private departmentApi: DepartmentApi,
    private refreshDataService: RefreshDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getDepartments()
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'department-list') {
        this.getDepartments();
      }
    }))
  }


  getDepartments() {
    this.departmentApi.apiDepartmentGet().subscribe(result => {
      this.departments = result;
    })
  }
  clear(table: Table) {
    table.clear();
  }

  onInputChange(event: Event, table: Table) {
    const target = event.target as HTMLInputElement;
    if (target instanceof HTMLInputElement) {
      table.filterGlobal(target.value, 'contains');
    }
  }

  deleteDepartment(departmentId: number) {
    this.departmentApi.apiDepartmentIdDelete({ id: departmentId }).subscribe({
      next: (res) => {
        this.getDepartments();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      error: (err) => {
        console.log("error while delete document:", err);
      }
    })
  }

  confirmDialog(departmentId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteDepartment(departmentId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
}
