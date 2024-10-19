import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallticketModalComponent } from './hallticket-modal.component';

describe('HallticketModalComponent', () => {
  let component: HallticketModalComponent;
  let fixture: ComponentFixture<HallticketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallticketModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallticketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
