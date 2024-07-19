import { Injectable } from '@angular/core';
import { Student } from '../../interfaces/Student';
import { Student as StudentApiPath } from '../../interfaces/api-call';
import { AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentPath: StudentApiPath;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.studentPath = this.appConfig.get('student');
  }

  getStudentList(): Observable<any> {
    return this.http.get(this.studentPath.studentList);
  }

  getStudentById(studentId: number): Observable<any> {
    const getByIdApiPath = this.studentPath.studentById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', studentId.toString());
    return this.http.get(getByIdApiPath);
  }

  saveStudent(payload: Student): Observable<Student> {
    return this.http.post<Student>(this.studentPath.savetStudent, payload);
  }

  updateStudent(payload: any): Observable<any> {
    return this.http.post(this.studentPath.updateStudent, payload);
  }

  deleteStudent(instructorId: number | string): Observable<any> {
    const deleteApiPath = this.studentPath.deleteStudent.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', instructorId.toString());
    return this.http.delete(deleteApiPath);
  }
}
