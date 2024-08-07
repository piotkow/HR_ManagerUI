import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DocumentApi, DocumentEmployeeResponse } from '../../../../libs/api-client';
import { CommonModule } from '@angular/common';
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast, ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {

  @Input() employeeID: string | null = '';
  documents!: DocumentEmployeeResponse[];
  private subscription: Subscription = new Subscription()

  constructor(
    private documentApi: DocumentApi,
    private refreshDataService: RefreshDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getDocuments();
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'document-list') {
        this.getDocuments();
      }
    }))
  }

  getDocuments() {
    if (this.employeeID) {
      this.documentApi.apiDocumentByEmployeeEmployeeIdGet({ employeeId: Number(this.employeeID) }).subscribe((data) => {
        this.documents = data;
      });
    }
  }

  deleteDocument(documentId: number) {
    this.documentApi.apiDocumentIdDelete({ id: documentId }).subscribe({
      next: (res) => {
        this.refreshDataService.refresh('document-list');
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      error: (err)=>{
        console.log("error while delete document:", err);
      }
    })
  }

  confirmDialog(documentId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteDocument(documentId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}
