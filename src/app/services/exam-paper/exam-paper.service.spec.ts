import { TestBed } from '@angular/core/testing';

import { ExamPaperService } from './exam-paper.service';

describe('ExamPaperService', () => {
  let service: ExamPaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamPaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
