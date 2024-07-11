import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const hasUserObj = user && typeof user === 'object' && Object.keys(user).length > 0;
    return hasUserObj && !!sessionStorage.getItem('token');
  }

  getAuthToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
