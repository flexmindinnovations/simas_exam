import { Injectable } from '@angular/core';
import { Instructor } from '../../interfaces/api-call';
import { AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private instructorPath: Instructor;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.instructorPath = this.appConfig.get('instructor');
  }

  getInstructorList(): Observable<any> {
    return this.http.get(this.instructorPath.getInstructorList);
  }

  saveInstructor(payload: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(this.instructorPath.savetInstructor, payload);
  }

  updateInstructor(payload: any): Observable<any> {
    return this.http.post(this.instructorPath.updateInstructor, payload);
  }

  deleteInstructor(instructorId: number | string): Observable<any> {
    const deleteApiPath = this.instructorPath.deleteInstructor.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', instructorId.toString());
    return this.http.delete(deleteApiPath);
  }
}
