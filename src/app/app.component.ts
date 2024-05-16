import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { AuthService } from './services/auth.service';



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HttpClientModule, NavbarComponent, SidebarComponent]
})
export class AppComponent {
  title = 'app';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  constructor(private authService: AuthService/*, private loadingService: LoadingService*/) { }

  ngOnInit(): void {
    this.authService.getUserLoginStatus().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      // this.loadingService.loading.subscribe(isLoading => {
      //   this.isLoading = isLoading;
      // });
    })
  }
}
