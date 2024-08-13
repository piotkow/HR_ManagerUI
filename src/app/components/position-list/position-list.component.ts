import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Position, PositionApi } from '../../../../libs/api-client';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';
import { AddPositionDialogComponent } from "../add-position-dialog/add-position-dialog.component";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-position-list',
  templateUrl: 'position-list.component.html',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, InputTextModule, AddPositionDialogComponent],
  providers: []
})
export class PositionListComponent {
  positions!: Position[];
  @ViewChild('dt1') dt1!: Table;
  private subscription: Subscription = new Subscription()

  constructor(private positionApi: PositionApi,
    private refreshDataService: RefreshDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getPositions();
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'position-list') {
        this.getPositions();
      }
    }))
  }

  getPositions() {
    this.positionApi.apiPositionGet().subscribe(result => {
      this.positions = result;
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

  deletePosition(positionId: number) {
    this.positionApi.apiPositionIdDelete({ id: positionId }).subscribe({
      next: (res) => {
        console.log(" doc id: ", positionId);
        this.getPositions();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      error: (err) => {
        console.log("error while delete document:", err);
      }
    })
  }

  confirmDialog(positionId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deletePosition(positionId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
}