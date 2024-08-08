import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private instructorPath: ApiCallConfig['instructor'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.instructorPath = this.appConfig.get('instructor');
  }

  getInstructorList(): Observable<any> {
    return this.http.get<any>(this.instructorPath.instructorList);
  }

  getInstructorListByFranchiseId(franchiseId: string): Observable<any> {
    const getByIdApiPath = this.instructorPath.instructorListByFranchiseId.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', franchiseId);
    return this.http.get<any>(getByIdApiPath);
  }

  getInstructorById(instructorId: number): Observable<any> {
    const getByIdApiPath = this.instructorPath.instructorById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', instructorId.toString());
    return this.http.get(getByIdApiPath);
  }

  saveInstructor(payload: any): Observable<any> {
    return this.http.post<any>(this.instructorPath.savetInstructor, payload);
  }

  updateInstructor(payload: any): Observable<any> {
    return this.http.post(this.instructorPath.updateInstructor, payload);
  }

  deleteInstructor(instructorId: number | string): Observable<any> {
    const deleteApiPath = this.instructorPath.deleteInstructor.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', instructorId.toString());
    return this.http.delete(deleteApiPath);
  }
}
