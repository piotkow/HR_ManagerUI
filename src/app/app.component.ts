import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HttpClientModule, NavbarComponent, SidebarComponent, ToastModule, ConfirmDialogModule]
})
export class AppComponent {
  title = 'app';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  constructor(private authService: AuthService/*, private loadingService: LoadingService*/) { }

  ngOnInit(): void {
    this.authService.getUserLoginStatus().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }
}
