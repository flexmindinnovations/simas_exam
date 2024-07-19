import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamComponent } from './add-edit-exam.component';

describe('AddEditExamComponent', () => {
  let component: AddEditExamComponent;
  let fixture: ComponentFixture<AddEditExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
