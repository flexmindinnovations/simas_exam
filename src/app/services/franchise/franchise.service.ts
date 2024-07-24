import { Injectable } from '@angular/core';
import { AppConfigService } from '../config/app-config.service';
import { Franchise } from '../../interfaces/api-call';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {


  private franchisePath: Franchise;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.franchisePath = this.appConfig.get('franchise');
  }

  getFranchiseList(): Observable<any> {
    return this.http.get(this.franchisePath.franchiseList);
  }

  saveFranchinse(payload: Franchise): Observable<Franchise> {
    return this.http.post<Franchise>(this.franchisePath.saveFranchise, payload);
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
