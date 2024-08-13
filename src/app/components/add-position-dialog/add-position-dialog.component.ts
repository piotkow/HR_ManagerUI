import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PositionApi, PositionRequest } from '../../../../libs/api-client';
import { RefreshDataService } from '../../services/refresh-data.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-position-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, InputTextModule],
  templateUrl: './add-position-dialog.component.html',
  styleUrl: './add-position-dialog.component.css'
})
export class AddPositionDialogComponent {
  visible: boolean = false;
  positionName: string="";
  positionDescription: string="";

  ngOnInit() {
  }

  showDialog() {
    this.visible = true;
  }

  constructor(
    private positionApi: PositionApi,
    private refreshDataService: RefreshDataService,
    private messageService: MessageService
  ) { }


  addNewPosition() {
    const positionReq: PositionRequest={
      positionName: this.positionName,
      positionDescription: this.positionDescription
    }
    this.positionApi.apiPositionPost({ positionRequest: positionReq}).subscribe(result=>{
      console.log('result dodania position', result);
      this.refreshDataService.refresh('position-list');
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Position added successfully' });
      this.positionName="";
      this.positionDescription="";
      this.visible=false;
    })
  }
}
