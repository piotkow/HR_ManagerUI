import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderComponent } from './calendar-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [CommonModule, FormsModule, CalendarModule, BrowserAnimationsModule],
  declarations: [CalendarHeaderComponent],
  exports: [CalendarHeaderComponent],
})
export class DemoUtilsModule {}
