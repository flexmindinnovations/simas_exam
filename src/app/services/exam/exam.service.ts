import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  examPath: any;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.examPath = this.appConfig.get('exam');
  }

  getExamList(): Observable<any> {
    return this.http.get(this.examPath);
  }

  getExamById(examId: number): Observable<any> {
    return this.http.get(this.examPath);
  }

  saveExam(payload: any): Observable<any> {
    return this.http.post(this.examPath, payload);
  }

  updateExam(payload: any): Observable<any> {
    return this.http.post(this.examPath, payload);
  }

  deleteExam(examId: number): Observable<any> {
    const deleteApiPath = '';
    return this.http.delete(deleteApiPath);
  }
}
