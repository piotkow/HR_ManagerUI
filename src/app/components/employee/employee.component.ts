import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DocumentApi, DocumentEmployeeResponse, EmployeeApi, EmployeePositionTeamResponse } from '../../../../libs/api-client';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadComponent } from '../upload/upload.component';
import { TableModule } from 'primeng/table';
import { DocumentListComponent } from '../document-list/document-list.component';
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CardModule, ImageModule, TagModule, CommonModule, FileUploadModule, ToastModule, BadgeModule, UploadComponent, TableModule, DocumentListComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})

export class EmployeeComponent {

  employeeID: string | null = '';
  employee?: EmployeePositionTeamResponse;
  documents? : DocumentEmployeeResponse[] = [];
  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeApi: EmployeeApi,
    private documentApi: DocumentApi,
    private sanitizer: DomSanitizer

  ){
    this.employeeID = this.activatedRoute.snapshot.paramMap.get('id');
  }

  sanitizeURL(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  ngOnInit(){
    this.employeeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getEmployee();
    this.getDocuments();
  }

  getEmployee(){
    this.employeeApi.apiEmployeeIdGet({id:Number(this.employeeID)}).subscribe((employee) => {
      if(employee){
        this.employee=employee;
      }
  });
  }

  getDocuments(){
    this.documentApi.apiDocumentByEmployeeEmployeeIdGet({employeeId:Number(this.employeeID)}).subscribe((documents)=>{
      if(documents){
        console.log("dokumenty w get:", documents);
        this.documents=documents;
      }
    })
  }

}
