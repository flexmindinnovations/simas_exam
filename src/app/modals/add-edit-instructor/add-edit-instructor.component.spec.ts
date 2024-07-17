import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInstructorComponent } from './add-edit-instructor.component';

describe('AddEditInstructorComponent', () => {
  let component: AddEditInstructorComponent;
  let fixture: ComponentFixture<AddEditInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
