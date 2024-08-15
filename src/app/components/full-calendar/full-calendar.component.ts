import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AbsenceApi, AbsencesEmployeeResponse, AccountEmployeeResponse } from '../../../../libs/api-client';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../services/refresh-data.service';


@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule, OverlayPanelModule],
  templateUrl: './full-calendar.component.html',
  styleUrl: './full-calendar.component.css'
})
export class FullCalendarComponent {
  // @ViewChild('op') overlayPanel!: OverlayPanel;
  constructor(
    private absenceApi: AbsenceApi,
    private storageService: StorageService,
    private refreshDataService: RefreshDataService,
  ) { }
  @Output() newItemEvent = new EventEmitter<DateSelectArg>();
  user?: AccountEmployeeResponse ;
  selectedDate?: string;
  absences :  AbsencesEmployeeResponse[]= [];
  events : {title: string, start: string, end: string}[]= [{title: 'Piotr Kowalczyk', start: '2024-08-07T00:00:00', end: '2024-08-16T00:00:00'}];
  calendarOptions!: CalendarOptions;
  private subscription: Subscription = new Subscription();
  @Input() teamIdToShowOnDialog?: number;

  ngOnInit(){
    this.updateCalendar();
    console.log("teamId", this.teamIdToShowOnDialog);
    this.user = this.storageService.get('user');
    console.log("user",this.user);
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'init-calendar') {
        this.updateCalendar();
      }
    }))
  }


  updateCalendar(){
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      select: (arg) => this.handleDateClick(arg),
      events:(info,successCallback, failureCallback) => {this.getTeamAbsences( this.teamIdToShowOnDialog ? this.teamIdToShowOnDialog : this.user?.teamID, successCallback)},
      headerToolbar:{
        right: 'dayGridDay,dayGridWeek,dayGridMonth',
        center: 'title',
        left: 'prev,next'
      }, 
      themeSystem: 'standard'
    };
  }
  
  addNewDate(value: DateSelectArg) {
    this.newItemEvent.emit(value);
  }

  handleDateClick(arg: DateSelectArg) {
    this.addNewDate(arg);
  }

  getTeamAbsences(teamId: number | undefined, successCallback: any) {
    if (teamId) {
        this.absenceApi.apiAbsenceByTeamTeamIdGet({ teamId: teamId }).subscribe({
            next: (result) => {
                this.absences = result;
                console.log("absences:", this.absences);
                // Mapping result to events compatible with EVENT_REFINERS
                let events = result.map(r => ({
                    id: r.absenceId?.toString(), // mapowanie absenceId na id
                    title: `${r.firstName} ${r.lastName}`, // mapowanie imienia i nazwiska na tytuł
                    start: r.startDate, // mapowanie startDate na start
                    end: r.endDate, // mapowanie endDate na end
                    allDay: true, // zakładamy, że nie są to wydarzenia całodniowe
                    extendedProps: {
                        description: r.description,
                        status: r.status,
                        rejectionReason: r.rejectionReason
                    },
                    backgroundColor: r.status == 'Pending' ? '#9ea0f6' : r.status == 'Approved' ? '#22c55e' : '#ff6259'
                }));
                console.log("events: ", events);
                successCallback(events);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}

}
