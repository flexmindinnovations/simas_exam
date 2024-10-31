import { Injectable } from '@angular/core';
import { Student } from '../../interfaces/Student';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentPath: ApiCallConfig['student'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.studentPath = this.appConfig.get('student');
  }

  getStudentList(): Observable<any> {
    return this.http.get(this.studentPath.studentList);
  }

  getStudentListByFranchiseId(franchiseId: string): Observable<any> {
    const getByIdApiPath = this.studentPath.studentListByFranchiseId.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', franchiseId);
    return this.http.get<any>(getByIdApiPath);
  }

  getStudentById(studentId: number): Observable<any> {
    const getByIdApiPath = this.studentPath.studentById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', studentId.toString());
    return this.http.get(getByIdApiPath);
  }

  saveStudent(payload: Student): Observable<Student> {
    return this.http.post<Student>(this.studentPath.saveStudent, payload);
  }

  uploadStudentDetails(payload: any): Observable<any> {
    return this.http.post<any>(this.studentPath.upload, payload);
  }

  updateStudent(payload: any): Observable<any> {
    return this.http.post(this.studentPath.updateStudent, payload);
  }

  uploadAndUpdateStudent(payload: any): Observable<any> {
    return this.http.post(this.studentPath.uploadandUpdateStudent, payload);
  }

  deleteStudent(instructorId: number | string): Observable<any> {
    const deleteApiPath = this.studentPath.deleteStudent.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', instructorId.toString());
    return this.http.delete(deleteApiPath);
  }
}
