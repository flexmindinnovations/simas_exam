import { TestBed } from '@angular/core/testing';

import { OfflineStudentService } from './offline-student.service';

describe('OfflineStudentService', () => {
  let service: OfflineStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
