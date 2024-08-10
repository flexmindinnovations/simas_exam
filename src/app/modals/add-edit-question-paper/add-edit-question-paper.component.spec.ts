import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuestionPaperComponent } from './add-edit-question-paper.component';

describe('AddEditQuestionPaperComponent', () => {
  let component: AddEditQuestionPaperComponent;
  let fixture: ComponentFixture<AddEditQuestionPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditQuestionPaperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditQuestionPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
