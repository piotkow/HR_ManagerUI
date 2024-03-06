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
          {label: 'Teams', icon: 'pi pi-fw pi-plus'},
          {label: 'Calendar', icon: 'pi pi-fw pi-download'},
          {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
      ];
  }

}
