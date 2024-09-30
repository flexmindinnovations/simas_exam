import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { utils } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class ExamCenterService {

  examCenterApi: ApiCallConfig['examCenter'];

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient
  ) {
    this.examCenterApi = this.appConfigService.get('examCenter');
  }

  getExamCenterList(): Observable<any> {
    return this.http.get(this.examCenterApi.examCenterList);
  }

  getExamCenterById(examCenterId: string): Observable<any> {
    const getByIdApiPath = utils.getCleanPath(this.examCenterApi.examCenterById, examCenterId);
    return this.http.get(getByIdApiPath);
  }

  saveExamCenter(payload: any): Observable<any> {
    return this.http.post<any>(this.examCenterApi.saveExamCenter, payload);
  }

  updateExamCenter(payload: any, examCenterId: string): Observable<any> {
    const getByIdApiPath = utils.getCleanPath(this.examCenterApi.updateExamCenter, examCenterId);
    return this.http.put(getByIdApiPath, payload);
  }

  deleteExamCenter(examCenterId: string): Observable<any> {
    const deleteApiPath = utils.getCleanPath(this.examCenterApi.deleteExamCenter, examCenterId);
    return this.http.delete(deleteApiPath);
  }
}
