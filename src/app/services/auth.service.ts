import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountApi, AccountEmployeeResponse } from '../../../libs/api-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelperService = inject(JwtHelperService);
  private router = inject(Router);
  private storageService = inject(StorageService)
  private loggedInSubject = new BehaviorSubject<boolean>(this.storageService.get('isLoggedIn') || false);
  private accountApi = inject (AccountApi);


  login(result: { [key: string]: any }): void {
    const decodedToken = this.jwtHelperService.decodeToken(result['token']);
    let userObject : AccountEmployeeResponse;
    if (decodedToken) {
      const accountId= decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.accountApi.apiAccountIdGet(accountId).subscribe((account)=>{
        userObject=account;
        this.storageService.set('token', result['token']);
        this.storageService.set('user', userObject);
        this.storageService.set('isLoggedIn', true);

        if (userObject.accountType?.toString() === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
          this.loggedInSubject.next(true);
        }
        else if (userObject.accountType?.toString()=== 'HR'){
          this.router.navigate(['/hr-dashboard'])
        }
        else {
          this.router.navigate(['/employee-dashboard']);
          this.loggedInSubject.next(true);
        }
      });
    }
  }

  logout(): void {
    this.storageService.clear();
    this.loggedInSubject.next(false);
    this.router.navigate(['/']);

  }

  getUserLoginStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getUserRole(): string {
    const user = this.storageService.get('user');
    return user ? user.role : '';
  }
}
