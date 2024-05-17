import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private storageService: StorageService) { }

  hasRole(roles: string[]) {
    const userStorageObject = this.storageService.get('user');

    if (userStorageObject) return roles.includes(userStorageObject.accountType);
    else return false;
  }
}
