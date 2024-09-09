import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { utils } from '../../utils';

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

  getLevelById(levelId: string): Observable<any> {
    const getByIdApiPath = utils.getCleanPath(this.levelApiPath.levelById, levelId);
    return this.http.get(getByIdApiPath);
  }

  saveLevel(payload: any): Observable<any> {
    return this.http.post<any>(this.levelApiPath.saveLevel, payload);
  }

  updateLevel(payload: any): Observable<any> {
    return this.http.post(this.levelApiPath.updateLevel, payload);
  }

  deleteLevel(levelId: string): Observable<any> {
    const deleteApiPath = utils.getCleanPath(this.levelApiPath.deleteLevel, levelId);
    return this.http.delete(deleteApiPath);
  }
}
