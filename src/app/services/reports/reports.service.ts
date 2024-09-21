import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  reportsPath: ApiCallConfig['reports'];
  constructor(
    private http: HttpClient,
    private apiConfigService: AppConfigService
  ) {
    this.reportsPath = this.apiConfigService.get('reports');
  }

  getExampByExamTypeAndLevel(payload: any): Observable<any> {
    const searchParams = new URLSearchParams(payload);
    return this.http.get(`${this.reportsPath.examPaperExamTypeAndLevelwise}?${searchParams}`);
  }

  getStudentListFromExamPaperLevelAndRoundWise(payload: any): Observable<any> {
    const searchParams = new URLSearchParams(payload);
    return this.http.get(`${this.reportsPath.studentListFromExamPaperLevelAndRoundWise}?${searchParams}`);
  }

  getStudentListFromExamPaperFranchiseAndInstructorWise(payload: any): Observable<any> {
    const searchParams = new URLSearchParams(payload);
    return this.http.get(`${this.reportsPath.studentListFromExamPaperFranchiseAndInstructorWise}?${searchParams}`);
  }
}
