import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCommonModule, CalendarDayModule, CalendarModule, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { DemoUtilsModule } from '../calendar-header/module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar.component';
import { CalendarMonthModule } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DemoUtilsModule,
    CalendarMonthModule,
    CalendarDayModule,
    CalendarWeekModule,
    CalendarCommonModule

  ],
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
})
export class DemoModule {}
