import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../interfaces/Country';
import { HttpClient } from '@angular/common/http';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { State } from '../../interfaces/State';
import { City } from '../../interfaces/City';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  locationPath: ApiCallConfig['location'];
  franchisePath: ApiCallConfig['franchise'];
  resultPath: ApiCallConfig['result'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.locationPath = this.appConfig.get('location');
    this.franchisePath = this.appConfig.get('franchise');
    this.resultPath = this.appConfig.get('result');
  }

  getCountryList(): Observable<Array<Country>> {
    return this.http.get<Array<Country>>(this.locationPath.country);
  }

  getStateList(countryId: number): Observable<Array<State>> {
    const stateApiPath = this.locationPath.state.replace('{{countryId}}', countryId.toString());
    return this.http.get<Array<State>>(stateApiPath);
  }

  getCityList(stateId: number): Observable<Array<City>> {
    const cityApiPath = this.locationPath.city.replace('{{stateId}}', stateId.toString());
    return this.http.get<Array<City>>(cityApiPath);
  }

  getFranchiseTypeList(): Observable<any> {
    return this.http.get(this.franchisePath.franchiseTypeList);
  }

  getFranchiseListByType(franchiseTypeId: number): Observable<any> {
    const franchiseListByTypeApi = this.franchisePath.franchiseListByType.replace('{{id}}', franchiseTypeId.toString())
    return this.http.get(franchiseListByTypeApi);
  }

  getDisplayResultListCompititionAndLevelWise(compititionId: any | number, levelId: any | number) {
    return this.http.get(this.resultPath.getDisplayResultListCompititionAndLevelWise(compititionId, levelId));
  }


  getDisplayResultListCompititionWise(compititionId: any | number) {
    return this.http.get(this.resultPath.getDisplayResultListCompititionWise(compititionId));
  }

}
