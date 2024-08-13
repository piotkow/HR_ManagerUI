import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { Department, DepartmentApi, DepartmentRequest } from '../../../../libs/api-client';
import { InputTextModule } from 'primeng/inputtext';
import { RefreshDataService } from '../../services/refresh-data.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-department-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule,  CommonModule, FormsModule, InputTextModule],
  templateUrl: './add-department-dialog.component.html',
  styleUrl: './add-department-dialog.component.css'
})
export class AddDepartmentDialogComponent {
  visible: boolean = false;
  department: DepartmentRequest={name:""};

  ngOnInit() {
  }

  showDialog() {
    this.visible = true;
  }

  constructor(
    private departmentApi: DepartmentApi,
    private refreshDataService: RefreshDataService,
    private messageService: MessageService
  ) { }


  addNewDepartment() {
    this.departmentApi.apiDepartmentPost({ departmentRequest:this.department}).subscribe(result=>{
      console.log('result dodania department', result);
      this.refreshDataService.refresh('department-list');
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Department added successfully' });
      this.department={name:""};
      this.visible=false;
    })
  }
}
