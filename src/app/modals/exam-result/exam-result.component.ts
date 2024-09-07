import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { utils } from '../../utils';
import { ExamPaperService } from '../../services/exam-paper/exam-paper.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './exam-result.component.html',
  styleUrl: './exam-result.component.scss',
  animations: [utils.heightIncrease]
})
export class ExamResultComponent implements OnInit {
  dialogData: any;
  examInputData: any;
  totalTime: any;
  questionList: any[] = [];
  isSubmitActionLoading: boolean = false;
  attemptedQuestions: any[] = [];
  correctQuestions: any[] = [];
  skippedQuestions: any[] = [];
  wrongQuestions: any[] = []

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private examPaperService: ExamPaperService
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.questionList = this.dialogData?.questionList;
    this.examInputData = this.dialogData?.examInputData;
    this.totalTime = this.dialogData?.totalTime;
    if (this.questionList?.length) {
      this.attemptedQuestions = this.questionList.filter((item: any) => item.isAttempted === true);
      this.skippedQuestions = this.questionList.filter((item: any) => item.isSkipped === true);
      this.wrongQuestions = this.questionList.filter((item: any) => item.isAttempted === true && item.isWrongAnswer === true);
      this.correctQuestions = this.questionList.filter((item: any) => item.isAttempted === true && item.isWrongAnswer === false);
    }
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.saveExamPaper();
  }

  saveExamPaper() {
    this.isSubmitActionLoading = true;
    const payload = this.questionList.map((item: any) => {
      const correctAnswer = item.isAttempted === true && item.isWrongAnswer === false;
      const obj = {
        examPaperId: 0,
        studentId: this.examInputData?.studentId,
        levelId: this.examInputData?.levelId,
        roundId: this.examInputData?.roundId,
        questionId: item?.questionBankDetailsId,
        examTypeId: this.examInputData?.examTypeId,
        examPaperDate: this.examInputData?.examPaperDate,
        examPaperTime: this.examInputData?.examPaperTime,
        answer: item?.userInput ?? '',
        answerStatus: correctAnswer ? 'Y' : 'N',
        answerType: item?.isAttempted ? 'Attempted' : 'Not Attempted',
        totalQuestions: this.questionList?.length,
        skipQuestions: this.skippedQuestions?.length,
        rightAnswer: this.correctQuestions?.length,
        wrongAnswer: this.wrongQuestions?.length,
        totalTimeTaken: item.timeTaken ?? this.totalTime
      };
      return obj;
    });
    const savePaperList = this.examPaperService.saveExamPaperList(payload);
    savePaperList.subscribe({
      next: (response) => {
        this.isSubmitActionLoading = false;
        this.dialogRef.close(response);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }
}
