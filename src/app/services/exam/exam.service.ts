import { Observable } from 'rxjs';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  examPath: ApiCallConfig['exam'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.examPath = this.appConfig.get('exam');
  }

  getExamList(): Observable<any> {
    return this.http.get(this.examPath.examList);
  }

  getExamById(examId: string): Observable<any> {
    const getByIdApiPath = this.examPath.examById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', examId);

    return this.http.get(getByIdApiPath);
  }

  saveExam(payload: any): Observable<any> {
    return this.http.post(this.examPath.saveExam, payload);
  }

  updateExam(payload: any): Observable<any> {
    return this.http.post(this.examPath.updateExam, payload);
  }

  deleteExam(examId: string): Observable<any> {
    const getByIdApiPath = this.examPath.deleteExam.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', examId);
    return this.http.delete(getByIdApiPath);
  }
}
