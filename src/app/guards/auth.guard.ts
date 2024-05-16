import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private permissionService: PermissionService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getUserLoginStatus().pipe(
      map((loggedIn: boolean) => {
        if (loggedIn) {
          const requiredRoles = next.data['roles'] as string[]

      if (this.permissionService.hasRole(requiredRoles)) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
          this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}
