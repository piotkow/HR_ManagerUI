import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DocumentApi, DocumentRequest } from '../../../../libs/api-client';
import { RefreshDataService } from '../../services/refresh-data.service';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FileUploadModule, ToastModule, BadgeModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  files: any[] = [];
  totalSize: number = 0;
  @Input() employeeID: string | null = '';
  totalSizePercent: number = 0;
  uploadedFiles: any[] = [];

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private documentApi: DocumentApi,
    private refreshDataService: RefreshDataService
  ) { }

  onUpload(event: FileUploadEvent) {
    console.log("id:", this.employeeID);
    for (let file of event.files) {
      this.documentApi.apiDocumentUploadDocumentPost({ document: file }).subscribe({
        next: (result) => {
          console.log("blob z azure: ", result);
          var newDocument: DocumentRequest = {
            employeeID: Number(this.employeeID),
            filename: result.name,
            issueDate: new Date().toISOString(),
            uri: result.uri
          };
          console.log("nowy dok obiekt:", newDocument);
          this.documentApi.apiDocumentPost({ documentRequest: newDocument }).subscribe({
            next: (result) => {
              console.log("dodany dok: ", result);
              this.refreshDataService.refresh('document-list');
              this.showSuccess();
            },
            error: (err) => { 
              console.log("error dok:", err);
              this.showError();
             }
          })
        },
        error: (err) => { 
          console.log("error azure:", err);
          this.showError();
         }
      }
      )
    }
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document Uploaded Successfully' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
  }
}
