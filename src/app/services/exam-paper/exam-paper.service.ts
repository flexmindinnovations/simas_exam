import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamPaperService {

  exampPaperApiPath: ApiCallConfig['examPaper'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.exampPaperApiPath = appConfig.get('examPaper');
  }

  getExamPaper(): Observable<any> {
    return this.http.get(this.exampPaperApiPath.examPaperList);
  }

  saveExamPaper(payload: any): Observable<any> {
    return this.http.post(this.exampPaperApiPath.SaveExamPaper, payload);
  }

  saveExamPaperList(payload: any): Observable<any> {
    return this.http.post(this.exampPaperApiPath.SaveExamPaperList, payload);
  }

  TempSaveExamPaperList(payload: any): Observable<any> {
    return this.http.post(this.exampPaperApiPath.TempSaveExamPaperList, payload);
  }
}
