import { TestBed } from '@angular/core/testing';

import { ExamCenterService } from './exam-center.service';

describe('ExamCenterService', () => {
  let service: ExamCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
