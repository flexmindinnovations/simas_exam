import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldRecordExamQuestionPanelComponent } from './world-record-exam-question-panel.component';

describe('WorldRecordExamQuestionPanelComponent', () => {
  let component: WorldRecordExamQuestionPanelComponent;
  let fixture: ComponentFixture<WorldRecordExamQuestionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldRecordExamQuestionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldRecordExamQuestionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
