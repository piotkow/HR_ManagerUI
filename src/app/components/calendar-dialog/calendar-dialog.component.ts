import { Component, Input } from '@angular/core';
import { FullCalendarComponent } from "../full-calendar/full-calendar.component";
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../services/refresh-data.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-calendar-dialog',
  standalone: true,
  imports: [FullCalendarComponent, DialogModule, ButtonModule],
  templateUrl: './calendar-dialog.component.html',
  styleUrl: './calendar-dialog.component.css'
})
export class CalendarDialogComponent {

  private subscription: Subscription = new Subscription();
  @Input() visible: boolean = false;
  @Input() teamIdToShowOnDialog?: number;

  constructor(
    private refreshDataService: RefreshDataService
  ) { }
  
  ngOnInit() {
    console.log("inicjalizacja dialogu calendara");
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'show-calendar-dialog') {
        this.showDialog();
      }
    }))
  }

  showDialog() {
    console.log("pokazuje dialoga");
    this.visible = true;
  }

  hideDialog(){
    // this.visible=false;
    this.refreshDataService.refresh('hide-calendar-dialog');
  }

}
