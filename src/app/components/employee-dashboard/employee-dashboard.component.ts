import { Component, Input, OnInit } from '@angular/core';
import { AbsenceApi, AccountEmployeeResponse, Status } from '../../../../libs/api-client';
import { StorageService } from '../../services/storage.service';
import { FullCalendarComponent } from "../full-calendar/full-calendar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateSelectArg } from '@fullcalendar/core';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AbsenceRequestListComponent } from "../absence-request-list/absence-request-list.component";
import { RefreshDataService } from '../../services/refresh-data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [FullCalendarComponent, ReactiveFormsModule, CommonModule, ButtonModule, InputTextareaModule, AbsenceRequestListComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit {

  absenceForm?: FormGroup;
  user?: AccountEmployeeResponse;
  selectedDate?: DateSelectArg;
  private subscription: Subscription = new Subscription()

  getDate(arg: DateSelectArg) {
    console.log(arg);
    this.selectedDate = arg;
    this.absenceForm?.patchValue({
      startDate: arg.startStr,
      endDate: arg.endStr
    })
  }

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private absenceApi: AbsenceApi,
    private refreshDataService: RefreshDataService
  ) {
    this.user = storageService.get('user');
  }

  ngOnInit(): void {
    const user: AccountEmployeeResponse = this.storageService.get('user');
    this.absenceForm = this.formBuilder.group({
      employeeID: [user.employeeID, Validators.required],
      description: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required],
      status: [Status.Pending, Validators.required],
      rejectionReason: [null]
    })
  }

  sendRequest() {
    console.log(this.absenceForm?.value);
    this.absenceApi.apiAbsencePost({ absenceRequest: this.absenceForm?.value }).subscribe({
      next: (res) => {
        this.refreshDataService.refresh('absence-request-list');
      },
      error: (err) => {
        console.log(err);
      }

    })
  }

}
