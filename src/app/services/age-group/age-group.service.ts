import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { utils } from '../../utils';


@Injectable({
  providedIn: 'root'
})
export class AgeGroupService {

  ageGroupApiPath: ApiCallConfig['ageGroup'];

  constructor(
    private apiConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.ageGroupApiPath = apiConfig.get('ageGroup');
  }

  getAgeGroupList(): Observable<any> {
    return this.http.get(this.ageGroupApiPath.getAgeGroupList);
  }

  saveAgeGroup(payload: any): Observable<any> {
    return this.http.post(this.ageGroupApiPath.saveAgeGroup, payload);
  }

  updateAgeGroup(payload: any): Observable<any> {
    return this.http.post(this.ageGroupApiPath.updateAgeGroup, payload);
  }

}
