import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ExamService } from '../../services/exam/exam.service';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-add-edit-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule],
  templateUrl: './add-edit-exam.component.html',
  styleUrl: './add-edit-exam.component.scss',
  animations: [utils.heightIncrease]
})
export class AddEditExamComponent implements OnInit {
  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private examService: ExamService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;

    this.initFormGroup();
  }



  initFormGroup() {
    this.formGroup = this.fb.group({
      roleName: ['', [Validators.required]],
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['examId'] = this.isEditMode ? this.dialogData?.examId : 0;
    const formData = new FormData();
    const status = formVal['status'];
    formVal['status'] = status === true ? '1' : '0';
    formData.append('examModel', JSON.stringify(formVal));
    let apiCall = this.examService.saveExam(formVal);
    if (this.isEditMode) {
      apiCall = this.examService.updateExam(formVal);
    }
    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        setTimeout(() => {
          this.dialogRef.close(res);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        this.dialogRef.close(false);
      }
    });
  }
}
