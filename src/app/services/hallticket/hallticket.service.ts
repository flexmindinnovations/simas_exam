import { Injectable } from '@angular/core';
import { ApiCallConfig, AppConfigService } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HallticketService {

  private hallticket: ApiCallConfig['hallticket'];
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) {
    this.hallticket = this.appConfig.get('hallticket');
  }

  getStudentHallTicketList({ compititionId, franchiseId, instructorId, examCenterId, batchTimeSlotId }: { compititionId: string, franchiseId: string, instructorId: string, examCenterId: string, batchTimeSlotId: string }): Observable<any> {
    const searchParams = new URLSearchParams({ compititionId, franchiseId, instructorId, examCenterId, batchTimeSlotId });
    return this.http.get(`${this.hallticket.getStudentHallTicketList}?${searchParams}`);
  }
}
