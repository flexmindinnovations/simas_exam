import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallConfig, AppConfigService } from './config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineStudentService {
  private offlineStudent: ApiCallConfig['offlineStudent'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.offlineStudent = this.appConfig.get('offlineStudent');
  }

  saveOfflineStudentMarkEntry(payload: any): Observable<any> {
    return this.http.post(this.offlineStudent.saveOfflineStudentMarkEntry, payload);
  }
  getOfflineStudentListCompititionIdWise({ compititionId }: { compititionId: string }): Observable<any> {
    const searchParams = new URLSearchParams({ compititionId });
    return this.http.get(`${this.offlineStudent.getOfflineStudentListCompititionIdWise}?${searchParams}`);
  }
}
