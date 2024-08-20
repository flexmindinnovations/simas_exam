import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { utils } from '../../utils';

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

  isSubmitActionLoading: boolean = false;
  attemptedQuestions: any[] = [];
  correctQuestions: any[] = [];
  skippedQuestions: any[] = [];
  wrongQuestions: any[] = []

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    if (this.dialogData?.length) {
      this.attemptedQuestions = this.dialogData.filter((item: any) => item.isAttempted === true);
      this.skippedQuestions = this.dialogData.filter((item: any) => item.isSkipped === true);
      this.wrongQuestions = this.dialogData.filter((item: any) => item.isAttempted === true && item.isWrongAnswer === true);
      this.correctQuestions = this.dialogData.filter((item: any) => item.isAttempted === true && item.isWrongAnswer === false);
    }
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.handleDialogCancel();
  }
}
