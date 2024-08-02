import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  private levelApiPath: ApiCallConfig['level'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.levelApiPath = this.appConfig.get('level');
  }

  getLevelList(): Observable<any> {
    return this.http.get(this.levelApiPath.levelList);
  }

  getLevelById(levelId: number): Observable<any> {
    const getByIdApiPath = this.levelApiPath.levelById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', levelId.toString());
    return this.http.get(getByIdApiPath);
  }

  saveLevel(payload: any): Observable<any> {
    return this.http.post<any>(this.levelApiPath.saveLevel, payload);
  }

  updateLevel(payload: any): Observable<any> {
    return this.http.post(this.levelApiPath.updateLevel, payload);
  }

  deleteLevel(levelId: number | string): Observable<any> {
    const deleteApiPath = this.levelApiPath.deleteLevel.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', levelId.toString());
    return this.http.delete(deleteApiPath);
  }
}
