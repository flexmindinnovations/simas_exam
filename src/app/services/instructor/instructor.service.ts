import { Injectable } from '@angular/core';
import { Instructor as InstructorApiPath } from '../../interfaces/api-call';
import { AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private instructorPath: InstructorApiPath;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.instructorPath = this.appConfig.get('instructor');
  }

  getInstructorList(): Observable<any> {
    return this.http.get(this.instructorPath.instructorList);
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
