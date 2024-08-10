import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { StorageService } from '../../../services/storage.service';
import { AccountEmployeeResponse } from '../../../../../libs/api-client';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user: AccountEmployeeResponse;

  constructor(
    private storageService: StorageService
  ) {
    this.user = this.storageService.get('user');
  }


  items: MenuItem[] | undefined;
  ngOnInit() {
    this.user = this.storageService.get('user');
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: this.user.accountType=='Employee' ? 'employee-dashboard' : 'hr-dashboard'},
      { label: 'Employees', icon: 'pi pi-fw pi-user', routerLink: 'employee-list' },
      { label: 'Teams', icon: 'pi pi-fw pi-users', routerLink: 'team-list' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      { label: 'Calendar', icon: 'pi pi-calendar', routerLink: 'employee-dashboard'}
    ];

    
    if (this.user.accountType === 'Employee') {
      this.items = this.items.filter(item => item.label !== 'Employees');
    }

  }

}
