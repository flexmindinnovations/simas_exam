import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuestionBankComponent } from './add-edit-question-bank.component';

describe('AddEditQuestionBankComponent', () => {
  let component: AddEditQuestionBankComponent;
  let fixture: ComponentFixture<AddEditQuestionBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditQuestionBankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
