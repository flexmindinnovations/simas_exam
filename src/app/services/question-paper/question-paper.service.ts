import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { utils } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class QuestionPaperService {

  questionPaperApiPath: ApiCallConfig['questionPaper'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.questionPaperApiPath = appConfig.get('questionPaper');
  }

  getQuestionPaperList(): Observable<any> {
    return this.http.get(this.questionPaperApiPath.getQuestionPaper);
  }
  getQuestionPaperById(questionPaperId: string): Observable<any> {
    const cleanPath = utils.getCleanPath(this.questionPaperApiPath.getQuestionPaperById, questionPaperId);
    return this.http.get(cleanPath);
  }
  saveQuestionPaper(payload: any): Observable<any> {
    return this.http.post(this.questionPaperApiPath.saveQuestionPaper, payload);
  }
  updateQuestionPaper(payload: any): Observable<any> {
    return this.http.post(this.questionPaperApiPath.updateQuestionPaper, payload);
  }
  deleteQuestionPaper(questionPaperId: string): Observable<any> {
    const cleanPath = utils.getCleanPath(this.questionPaperApiPath.deleteQuestionPaper, questionPaperId);
    return this.http.get(cleanPath);
  }
}
