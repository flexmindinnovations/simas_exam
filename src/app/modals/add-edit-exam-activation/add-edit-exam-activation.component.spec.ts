import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamActivationComponent } from './add-edit-exam-activation.component';

describe('AddEditExamActivationComponent', () => {
  let component: AddEditExamActivationComponent;
  let fixture: ComponentFixture<AddEditExamActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExamActivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExamActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
