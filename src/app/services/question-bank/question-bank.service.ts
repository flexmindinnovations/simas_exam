import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { utils } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  questionBankApiPath: ApiCallConfig['questionBank'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.questionBankApiPath = appConfig.get('questionBank');
  }

  getQuestionBankList(): Observable<any> {
    return this.http.get(this.questionBankApiPath.questionBankList);
  }

  getQuestionBankById(questionBankId: string): Observable<any> {
    const cleanPath = utils.getCleanPath(this.questionBankApiPath.questionBankById, questionBankId);
    return this.http.get(cleanPath);
  }

  questionBankListExamTypeAndLessonWise({ levelId, examTypeId, lessonId }: { levelId: string, examTypeId: string, lessonId: string }): Observable<any> {
    const searchParams = new URLSearchParams({ levelId, examTypeId, lessonId });
    return this.http.get(`${this.questionBankApiPath.questionBankList}?${searchParams}`);
  }

  questionBankListExamTypeAndTypeWise({ levelId, examTypeId, type }: { levelId: string, examTypeId: string, type: string }): Observable<any> {
    const searchParams = new URLSearchParams({ levelId, examTypeId, type });
    return this.http.get(`${this.questionBankApiPath.questionBankList}?${searchParams}`);
  }

  questionBankListExamTypeAndLessonORTypeWise({ levelId, examTypeId, lessonId, type }: { levelId: string, examTypeId: string, lessonId: string, type: string }): Observable<any> {
    const searchParams = new URLSearchParams({ levelId, examTypeId, lessonId, type });
    return this.http.get(`${this.questionBankApiPath.questionBankList}?${searchParams}`);
  }

  flashAnzanQuestionBankListExamTypeAndLevelWise({ levelId, examTypeId, noOfColumn, noOfRow }: { levelId: string, examTypeId: string, noOfColumn: string, noOfRow: string }): Observable<any> {
    const searchParams = new URLSearchParams({ levelId, examTypeId, noOfColumn, noOfRow });
    return this.http.get(`${this.questionBankApiPath.questionBankList}?${searchParams}`);
  }

  updateQuestionBank(payload: string): Observable<any> {
    return this.http.post(this.questionBankApiPath.updateQuestionBank, payload);
  }

  uploadQuestionBankFile(payload: any): Observable<any> {
    return this.http.post<any>(this.questionBankApiPath.uploadFile, payload);
  }

  deleteQuestionBank(questionBankId: string): Observable<any> {
    const cleanPath = utils.getCleanPath(this.questionBankApiPath.deleteQuestionBank, questionBankId);
    return this.http.delete<any>(cleanPath);
  }
}
