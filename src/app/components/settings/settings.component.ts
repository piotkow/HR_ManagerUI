import { Component } from '@angular/core';
import { PositionListComponent } from "../position-list/position-list.component";
import { DepartmentListComponent } from "../department-list/department-list.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PositionListComponent, DepartmentListComponent, ConfirmDialogModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
