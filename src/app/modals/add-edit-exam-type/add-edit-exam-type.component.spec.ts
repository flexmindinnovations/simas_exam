import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamTypeComponent } from './add-edit-exam-type.component';

describe('AddEditExamTypeComponent', () => {
  let component: AddEditExamTypeComponent;
  let fixture: ComponentFixture<AddEditExamTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExamTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
