import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCallConfig, AppConfigService } from './config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BatchAllocationService {

  private batchAllocation: ApiCallConfig['batchAllocation'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.batchAllocation = this.appConfig.get('batchAllocation');
  }

  saveStudentBatchAllocation(payload: any): Observable<any> {
    return this.http.post(this.batchAllocation.saveStudentBatchAllocation, payload);
  }
}
