import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { DemoUtilsModule } from './module';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.css'
})
export class CalendarHeaderComponent {
  @Input() view: CalendarView = CalendarView.Day;

  @Input() viewDate: Date = new Date();

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
}
