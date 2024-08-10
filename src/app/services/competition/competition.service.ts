import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  competitionApiPath: ApiCallConfig['competition'];

  constructor(
    private apiConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.competitionApiPath = apiConfig.get('competition');
  }

  getCompetitionList(): Observable<any> {
    return this.http.get(this.competitionApiPath.competitionList);
  }
  getCompetitionById(competitionId: string): Observable<any> {
    const getByIdApiPath = this.competitionApiPath.competitionById.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', competitionId);

    return this.http.get(getByIdApiPath);
  }

  SaveCompetition(payload: any): Observable<any> {
    return this.http.post(this.competitionApiPath.saveCompetition, payload);
  }

  updateCompetition(payload: any): Observable<any> {
    return this.http.put(this.competitionApiPath.updateCompetition, payload);
  }
}
