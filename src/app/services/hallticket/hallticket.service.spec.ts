import { TestBed } from '@angular/core/testing';

import { HallticketService } from './hallticket.service';

describe('HallticketService', () => {
  let service: HallticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HallticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
