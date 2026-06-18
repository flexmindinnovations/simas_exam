import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-exam-start-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './exam-start-popup.component.html',
  styleUrls: ['./exam-start-popup.component.scss']
})
export class ExamStartPopupComponent {

  selectedOption = 'type';

  constructor(
    public ref: DynamicDialogRef
  ) { }

  startExam() {
    this.ref.close({
      isTypeAnswer: this.selectedOption === 'type',
      isShowAnswer: this.selectedOption === 'show'
    });
  }
}