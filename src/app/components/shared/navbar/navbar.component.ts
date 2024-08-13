import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton'
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { AccountEmployeeResponse } from '../../../../../libs/api-client';
import { Subscription } from 'rxjs';
import { RefreshDataService } from '../../../services/refresh-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TabMenuModule, AvatarModule, OverlayPanelModule, ButtonModule, ToggleButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private refreshDataService: RefreshDataService
  ){}
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  user?: AccountEmployeeResponse;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.user = this.storageService.get('user');
    this.subscription.add(this.refreshDataService.refreshSubject.subscribe((index) => {
      if (index === 'logged-user') {
        this.user = this.storageService.get('user');
      }
    }))
      this.items = [
          { label: 'Home', icon: 'pi pi-fw pi-home' },
          { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
          { label: 'Profile', icon: 'pi pi-fw pi-pencil' }

      ];

      this.activeItem = this.items[0];
  }

  logout(){
    this.authService.logout();
    window.location.reload();
  }
}
