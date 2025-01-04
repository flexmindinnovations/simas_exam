import { QuestionPaperService } from './../../services/question-paper/question-paper.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { QUESTION_TYPES } from '../../../../public/data/question-types';
import { forkJoin } from 'rxjs';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';

@Component({
  selector: 'app-add-edit-question-paper',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, TooltipModule],
  templateUrl: './add-edit-question-paper.component.html',
  styleUrl: './add-edit-question-paper.component.scss'
})
export class AddEditQuestionPaperComponent implements OnInit, AfterViewInit {

  dialogData: any;
  formGroup!: FormGroup;

  isAddLoading: boolean = false;
  isRemoveLoading: boolean = false;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  levelListLoading: boolean = false;
  roundListLoading: boolean = false;
  examTypeListLoading: boolean = false;

  questionTypeList: any[] = QUESTION_TYPES;
  levelList: any[] = [];
  roundList: any[] = [];
  examTypeList: any[] = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private questionPaperService: QuestionPaperService,
    private examTypeService: ExamTypeService,
    private levelService: LevelService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    this.initFormGroup();
    this.getPopupData();
  }

  ngAfterViewInit(): void {
    if (this.isEditMode && this.dialogData) {
      const formData = JSON.parse(JSON.stringify(this.dialogData));
      formData['status'] = formData['status'] === '1' ? true : false;
      const children = this.dialogData?.children.map((item: any) => {
        const obj = {
          questionPaperId: item?.questionPaperId ?? 0,
          questionType: item?.questionType?.toLowerCase() ?? '',
          columns: item?.columns ?? '',
          rows: item?.rows ?? '',
          noOfQuestion: item?.noOfQuestion ?? '',
          markPerQuestion: item?.markPerQuestion ?? ''
        }
        return obj;
      });
      delete formData.children;
      this.formGroup.patchValue(formData);
      setTimeout(() => {
        this.questionPapers.clear();
        children.forEach((item: any) => {
          const control = this.addFormArrayControl();
          control.patchValue(item);
          this.questionPapers.push(control);
        })

      })
      this.cdref.detectChanges();
    }

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, ![Validators.required]],
      levelId: ['', [Validators.required]],
      levelName: ['', ![Validators.required]],
      roundId: ['', [Validators.required]],
      roundName: ['', ![Validators.required]],
      examTypeId: ['', [Validators.required]],
      examTypeName: ['', ![Validators.required]],
      questionPaperDetailsModels: this.isEditMode ? this.fb.array([]) : this.fb.array(
        [
          this.addFormArrayControl()
        ]
      )
    })
  }

  get questionPapers(): FormArray {
    return this.formGroup.get('questionPaperDetailsModels') as FormArray;
  }

  addFormArrayControl() {
    return this.fb.group({
      questionPaperDetailId: [0, ![Validators.required]],
      questionPaperId: [0, ![Validators.required]],
      questionType: ['', [Validators.required]],
      columns: ['', [Validators.required]],
      rows: ['', [Validators.required]],
      noOfQuestion: ['', [Validators.required, utils.rangeValidator(0, 60)]],
      markPerQuestion: ['', [Validators.required]]
    })
  }

  handleOnDropdownValueChange(event: any, src: string) {
    const value = event?.value;
    switch (src) {
      case 'level':
        this.roundListLoading = true;
        const roundList = this.levelList?.find((item: any) => item.levelId === value)?.examRoundList;
        if (roundList?.length) {
          this.roundList = roundList;
          this.roundListLoading = false;
        }
        break;
    }
  }

  getPopupData() {
    this.levelListLoading = true;
    this.examTypeListLoading = true;
    const examTypeList = this.examTypeService.getExamTypeList();
    const levelList = this.levelService.getLevelList();
    forkJoin({ examTypeList, levelList }).subscribe({
      next: (response) => {
        if (response) {
          const { examTypeList, levelList } = response;
          this.levelList = levelList;
          this.examTypeList = examTypeList;
          const roundList = this.levelList?.find((item: any) => item.levelId === this.dialogData?.levelId)?.examRoundList;
          if (roundList?.length) {
            this.roundList = roundList;
          }
          if (levelList?.length) this.levelListLoading = false;
          if (examTypeList?.length) this.examTypeListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.levelListLoading = false;
        this.examTypeListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleAddItem() {
    this.questionPapers.push(this.addFormArrayControl());
  }

  handleRemoveItem(index: number) {
    this.questionPapers.removeAt(index);
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    if (this.formGroup.invalid) {
      const invalidControls = utils.getInvalidControls(this.formGroup);
      return;
    }
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['questionPaperId'] = this.isEditMode ? this.dialogData?.questionPaperId : 0;
    const questionPaperDetailsModels = formVal['questionPaperDetailsModels'].map((item: any) => {
      const obj = {
        questionPaperDetailId: formVal['questionPaperDetailId'] ?? 0,
        questionPaperId: formVal['questionPaperId'] ?? 0,
        questionType: item?.questionType ?? '',
        columns: item?.columns ?? '',
        rows: item?.rows ?? '',
        noOfQuestion: item?.noOfQuestion ?? '',
        markPerQuestion: item?.markPerQuestion ?? ''
      }
      return obj;
    });
    formVal['questionPaperDetailsModels'] = questionPaperDetailsModels;
    delete formVal['status'];

    let apiCall = this.questionPaperService.saveQuestionPaper(formVal);
    if (this.isEditMode) {
      apiCall = this.questionPaperService.updateQuestionPaper(formVal);
    }

    apiCall.subscribe({
      next: (response) => {
        this.isSubmitActionLoading = false;
        setTimeout(() => {
          this.dialogRef.close(response);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        this.dialogRef.close(false);
      }
    });
  }

}
