import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { colors } from '../calendar-header/colors';
import { DOCUMENT} from '@angular/common';
import { CalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { DemoUtilsModule } from '../calendar-header/module';
import { DemoModule } from './module';

@Component({
  providers: [DemoUtilsModule, DemoModule],
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;

  viewDate = new Date();

  events: CalendarEvent[] = [
    {
      title: 'An event',
      start: new Date(),
      color: colors.red,
    },
  ];

  private readonly darkThemeClass = 'dark-theme';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.document.body.classList.add(this.darkThemeClass);
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove(this.darkThemeClass);
  }
}
