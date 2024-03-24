import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {MenuModule} from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  items: MenuItem[] | undefined;
  ngOnInit() {
      this.items = [
          {label: 'Employees', icon: 'pi pi-fw pi-user', routerLink: 'employee-list'},
          {label: 'Teams', icon: 'pi pi-fw pi-users', routerLink: 'team-list'},
          {label: 'Calendar', icon: 'pi pi-fw pi-calendar', routerLink: 'calendar'},
          {label: 'Settings', icon: 'pi pi-fw pi-cog'},
      ];
  }

}
