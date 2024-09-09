import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamCenterComponent } from './add-edit-exam-center.component';

describe('AddEditExamCenterComponent', () => {
  let component: AddEditExamCenterComponent;
  let fixture: ComponentFixture<AddEditExamCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExamCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExamCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
