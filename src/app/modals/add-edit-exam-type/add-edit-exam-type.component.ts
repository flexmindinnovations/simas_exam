import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { utils } from '../../utils';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-edit-exam-type',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule],
  templateUrl: './add-edit-exam-type.component.html',
  styleUrl: './add-edit-exam-type.component.scss'
})
export class AddEditExamTypeComponent implements OnInit {

  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private examTypeService: ExamTypeService,
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
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      // status: [true, ![Validators.required]],
      examTypeName: ['', [Validators.required]],
    });
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['examTypeId'] = this.isEditMode ? this.dialogData?.examTypeId : 0;
    const formData = new FormData();
    const status = formVal['status'];
    // formVal['status'] = status === true ? '1' : '0';
    formData.append('examTypeModel', JSON.stringify(formVal));
    let apiCall = this.examTypeService.saveExamType(formVal);
    if (this.isEditMode) {
      apiCall = this.examTypeService.updateExamType(formVal);
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
