import { TestBed } from '@angular/core/testing';

import { BatchAllocationService } from './batch-allocation.service';

describe('BatchAllocationService', () => {
  let service: BatchAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
