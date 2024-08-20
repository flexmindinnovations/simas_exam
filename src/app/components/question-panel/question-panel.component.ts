import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-question-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-panel.component.html',
  styleUrl: './question-panel.component.scss'
})
export class QuestionPanelComponent implements OnInit, OnChanges {

  @Input({ required: true }) questionsList: Array<QuestionItem> = [];
  @Input({ required: true }) activeQuestion: any;
  @Input({ required: true }) activeQuestionIndex: any = 0;
  @Input({ required: true }) examStarted: boolean = false;

  @Output() selectedQuestion: EventEmitter<QuestionItem> = new EventEmitter();

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.activeQuestion = changes['activeQuestion'].currentValue;
      this.activeQuestionIndex = changes['activeQuestionIndex'].currentValue;
      if (this.questionsList.length && this.activeQuestionIndex >= 0) {
        this.questionsList.forEach((q: QuestionItem) => q.isActive = false);
        this.questionsList[this.activeQuestionIndex].isActive = true;
      }
    }
  }

  handleQuestionClick(item: QuestionItem, index: number) {
    this.questionsList.forEach((q: QuestionItem) => q.isActive = false);
    item.isActive = true;
    this.selectedQuestion.emit({ ...item, questionIndex: index });
  }
}

export type QuestionItem = {
  questionBankId: number;
  levelId: number;
  roundId: number;
  roundName: string;
  levelName: string;
  questionType: string;
  examTypeId: number;
  examTypeName: string;
  noOfColumnsOfFlashAnzan: number | null;
  noOfRowsOfFlashAnzan: number | null;
  questionBankDetailsId: number;
  noOfColumn: number;
  noOfRow: number;
  questions: string;
  answer: string;
  examPaperTime: number | null;
  reg_Abacus_Time: number | null;
  reg_Anzan_Time: number | null;
  isActive: boolean;
  questionIndex?: number;
  isCompleted?: boolean;
  isSkipped?: boolean;
  isAttempted?: boolean;
  isWrongAnswer?: boolean;
}
