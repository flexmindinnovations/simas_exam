import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamActivationComponent } from './exam-activation.component';

describe('ExamActivationComponent', () => {
  let component: ExamActivationComponent;
  let fixture: ComponentFixture<ExamActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamActivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
