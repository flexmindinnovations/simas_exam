import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamStartPopupComponent } from './exam-start-popup.component';

describe('ExamStartPopupComponent', () => {
  let component: ExamStartPopupComponent;
  let fixture: ComponentFixture<ExamStartPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamStartPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamStartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
