import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { AccountEmployeeResponse, Role } from '../../../../libs/api-client';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  user?: AccountEmployeeResponse;
  constructor(private storageService: StorageService){
    this.user=storageService.get('user');
  }
}
