import { Injectable } from '@angular/core';
import { utils } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  private userType: string = '';

  constructor() {
    const roleName = sessionStorage.getItem('role') || '';
    const secretKey = sessionStorage.getItem('token') || '';

    this.userType = roleName && secretKey ? utils.decryptString(roleName, secretKey) : '';
  }

  getUserType(): string {
    return this.userType;
  }

  setUserType(userType: string): void {
    this.userType = userType;
  }
}
