import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAllocationComponent } from './batch-allocation.component';

describe('BatchAllocationComponent', () => {
  let component: BatchAllocationComponent;
  let fixture: ComponentFixture<BatchAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
