import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Role } from '../../../libs/api-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  isLoggedIn: boolean = false;
  canActivate(): Observable<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      this.authService.getUserLoginStatus().subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          const userRole = this.authService.getUserRole();
          if (userRole === Role.Admin) {
            this.router.navigate(['/admin-dashboard']);
          } else if (userRole === Role.Hr) {
            this.router.navigate(['/hr-dashboard']);
          }
          else if (userRole === Role.Employee) {
            this.router.navigate(['/employee-dashboard']);
          }
          observer.next(false);
        } else {
          observer.next(true);
        }
        observer.complete();
      });
    });
  }
}
