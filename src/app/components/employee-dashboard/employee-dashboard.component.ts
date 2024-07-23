import { Component } from '@angular/core';
import { AccountEmployeeResponse } from '../../../../libs/api-client';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  user?: AccountEmployeeResponse;
  constructor(private storageService: StorageService){
    this.user=storageService.get('user');
  }
}
