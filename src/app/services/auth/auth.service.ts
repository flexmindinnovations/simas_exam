import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenPath: ApiCallConfig['login'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.tokenPath = this.appConfig.get('login');
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const hasUserObj = user && typeof user === 'object' && Object.keys(user).length > 0;
    // return hasUserObj && !!sessionStorage.getItem('token');
    return !!sessionStorage.getItem('token');
  }

  createAuthToken(
    payload: { userName: string, userPassword: string }
  ): Observable<any> {
    return this.http.post(this.tokenPath.createToken, payload);
  }

  getAuthToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
