import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';


@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [FullCalendarModule, OverlayPanelModule],
  templateUrl: './full-calendar.component.html',
  styleUrl: './full-calendar.component.css'
})
export class FullCalendarComponent {
  // @ViewChild('op') overlayPanel!: OverlayPanel;
  @Output() newItemEvent = new EventEmitter<DateSelectArg>();
  selectedDate?: string;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    select:(arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2024-07-01' },
      { title: 'event 2', date: '2024-07-02' }
    ]
  };

  addNewDate(value: DateSelectArg) {
    this.newItemEvent.emit(value);
  }

  handleDateClick(arg: DateSelectArg) {
    this.addNewDate(arg);
  }

  getTeamAbsences(){
    
  }


}
