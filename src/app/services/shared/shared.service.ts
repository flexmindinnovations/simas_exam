import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../interfaces/Country';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';
import { Location } from '../../interfaces/api-call';
import { State } from '../../interfaces/State';
import { City } from '../../interfaces/City';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  locationPath: Location;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.locationPath = this.appConfig.get('location');
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
}
