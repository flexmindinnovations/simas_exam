import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  activationPath: ApiCallConfig['activation'];
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient
  ) {
    this.activationPath = appConfigService.get('activation');
  }

  saveActivation(payload: any): Observable<any> {
    return this.http.post(this.activationPath.saveActivation, payload);
  }
  updateActivation(payload: any): Observable<any> {
    return this.http.put(this.activationPath.updateActivation, payload);
  }
  saveMultipleActivation(payload: any): Observable<any> {
    return this.http.post(this.activationPath.saveMultipleActivation, payload);
  }
  saveMultipleExamActivation(payload: any): Observable<any> {
    return this.http.post(this.activationPath.saveMultipleExamActivation, payload);
  }
}
