import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { QUESTION_TYPES } from '../../../../public/data/question-types';
import { TYPES } from '../../../../public/data/types';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { utils } from '../../utils';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { ExamService } from '../../services/exam/exam.service';
import { LevelService } from '../../services/level/level.service';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';

@Component({
  selector: 'app-add-edit-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule],
  templateUrl: './add-edit-question-bank.component.html',
  styleUrl: './add-edit-question-bank.component.scss'
})
export class AddEditQuestionBankComponent implements OnInit {

  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  isExamTypeNameListLoading: boolean = false;
  levelNameListLoading: boolean = false;
  roundNameListLoading: boolean = false;
  questionTypeListLoading: boolean = false;
  typeListLoading: boolean = false;

  questionTypeList: Array<QuestionType> = QUESTION_TYPES;
  typeList: Array<Type> = TYPES;

  examTypeNameList: Array<any> = [];
  levelNameList: Array<any> = [];
  roundNameList: Array<any> = [];

  selectedFiles: File[] = [];
  selectedFileName: string = 'No file chosen';

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private questionBankService: QuestionBankService,
    private examTypeService: ExamTypeService,
    private levelService: LevelService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    setTimeout(() => {
      utils.isAddActionLoading.set(false);
      utils.isTableEditAction.set(false);
    })
    this.initFormGroup();
    this.getPopupData();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      examTypeName: ['', [Validators.required]],
      levelName: ['', [Validators.required]],
      roundName: ['', [Validators.required]],
      questionType: ['', [Validators.required]],
      // typeName: ['', [Validators.required]],
      noOfRows: ['', [Validators.required]],
      noOfColumns: ['', [Validators.required]],
      file: ['', [Validators.required]]
    });
  }

  getPopupData() {
    const examList = this.examTypeService.getExamTypeList();
    const levelList = this.levelService.getLevelList();
    forkJoin({ examList, levelList }).subscribe({
      next: (response) => {
        if (response) {
          const { examList, levelList } = response;
          this.levelNameList = levelList;
          this.examTypeNameList = examList;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = files;
    if (files.length) {
      this.selectedFileName = files[0].name;
      this.formGroup.get('file')?.setValue(files[0].name);
    } else {
      this.selectedFileName = this.selectedFiles ? this.selectedFiles[0].name : 'No file chosen';
    }
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    delete formVal['file'];
    const formData = new FormData();
    if (this.isEditMode) formVal['questionBankId'] = this.dialogData?.questionBankId;
    // const status = formVal['status'];
    // formVal['status'] = status === true ? '1' : '0';
    formData.append('questionBankModel', JSON.stringify(formVal));
    if (this.selectedFiles?.length) {
      formData.append('file', this.selectedFiles[0], this.selectedFiles[0].name);
    }
    let apiCall = this.questionBankService.updateQuestionBank(formVal);
    if (this.selectedFiles?.length) {
      apiCall = this.questionBankService.uploadQuestionBankFile(formData);
    }
    if (this.isEditMode && this.selectedFiles?.length) {
      apiCall = this.questionBankService.uploadQuestionBankFile(formData);
    }
    if (this.isEditMode && !this.selectedFiles?.length) {
      apiCall = this.questionBankService.updateQuestionBank(formVal);
    }
    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        setTimeout(() => {
          this.dialogRef.close(res);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.setMessages(error.message, 'error');
        this.dialogRef.close(false);
      }
    })
  }

  handleOnExamTypeListChange(event: DropdownChangeEvent) {
    console.log('event: ', event.value);

  }

  handleOnLevelListChange(event: DropdownChangeEvent) {
    console.log('event: ', event.value);
    const levelId = event.value;
    let roundList = this.levelNameList.filter((item: any) => item?.levelId === levelId)[0];
    console.log('roundList: ', roundList);
    if (roundList) {
      roundList = roundList?.examRoundList;
      console.log('roundList: ', roundList);

      this.roundNameList = roundList;
    }
  }
  handleOnRoundListChange(event: DropdownChangeEvent) {
    console.log('event: ', event.value);

  }
  handleOnQuestionTypeListChange(event: DropdownChangeEvent) {
    console.log('event: ', event.value);

  }
  handleOnTypeListChange(event: DropdownChangeEvent) {
    console.log('event: ', event.value);

  }
}

type QuestionType = {
  id: number;
  title: string;
  value: string;
};

type Type = {
  id: number;
  title: string;
  value: string;
};
