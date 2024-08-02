import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamTypeService {

  examTypeApiPath: ApiCallConfig['examType'];
  constructor(
    private apiConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.examTypeApiPath = apiConfig.get('examType');
  }

  getExamTypeList(): Observable<any> {
    return this.http.get(this.examTypeApiPath.examTypeList);
  };

  getExamTypeById(examTypeId: string): Observable<any> {
    const getByIdApiPath = this.examTypeApiPath.examTypeById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', examTypeId);

    return this.http.get(getByIdApiPath);
  };

  saveExamType(payload: any): Observable<any> {
    return this.http.post(this.examTypeApiPath.saveExamType, payload);
  };
  
  updateExamType(payload: any): Observable<any> {
    return this.http.post(this.examTypeApiPath.updateExamType, payload);
  };

  deleteExamType(examTypeId: string): Observable<any> {
    const getByIdApiPath = this.examTypeApiPath.deleteExamType.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', examTypeId);

    return this.http.delete(getByIdApiPath);

  };
}
