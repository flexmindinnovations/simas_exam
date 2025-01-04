import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {


  private franchisePath: ApiCallConfig['franchise'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.franchisePath = this.appConfig.get('franchise');
  }

  getFranchiseById(franchiseId: any): Observable<any> {
    const apiPath = this.franchisePath.franchiseById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', franchiseId);
    return this.http.get(apiPath);
  }

  getFranchiseTypeList(): Observable<any> {
    return this.http.get(this.franchisePath.franchiseList);
  }

  getFranchiseByTypeList(franchiseTypeId: string): Observable<any> {
    const listApiPath = this.franchisePath.franchiseListByType.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', franchiseTypeId);
    return this.http.get(listApiPath);
  }

  saveFranchinse(payload: any): Observable<any> {
    return this.http.post<any>(this.franchisePath.saveFranchise, payload);
  }

  updateFranchinse(payload: any): Observable<any> {
    return this.http.post(this.franchisePath.updateFranchise, payload);
  }

  uploadAndUpdateFranchinse(payload: any): Observable<any> {
    return this.http.post(this.franchisePath.uploadAndUpdateFranchise, payload);
  }

  uploadAndSaveFranchinse(payload: any): Observable<any> {
    return this.http.post<any>(this.franchisePath.uploadFranchise, payload);
  }

  deleteFranchinse(franchiseId: number | string): Observable<any> {
    const deleteApiPath = this.franchisePath.deleteFranchise.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', franchiseId.toString());
    return this.http.delete(deleteApiPath);
  }
}
