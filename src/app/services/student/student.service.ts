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
    this.studentPath = this.appConfig.apiConfigData.student;
  }

  getStudentList(): Observable<any> {
    return this.http.get(this.studentPath.studentList);
  }

  getStudentListByInstructor(instructorId: any | number): Observable<any> {
    return this.http.get(this.studentPath.studentListInstructorWise(instructorId));
  }

  getStudentListByFranchiseId(franchiseId: any | number): Observable<any> {
    return this.http.get(this.studentPath.studentListByFranchiseId(franchiseId));
  }

  getStudentListWithBatchAllocation(compititionId: any | number, franchiseId: any | number) {
    return this.http.get(this.studentPath.studentListWithBatchAllocation(compititionId, franchiseId));
  }

  public getStudentById(studentId: any): Observable<any> {
    return this.http.get(this.studentPath.studentById(studentId));
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
