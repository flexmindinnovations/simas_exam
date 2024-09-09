import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { utils } from '../../utils';
import type { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-exam-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, TooltipModule],
  templateUrl: './add-edit-exam-center.component.html',
  styleUrl: './add-edit-exam-center.component.scss'
})
export class AddEditExamCenterComponent implements OnInit, AfterViewInit {
  dialogData: any;
  formGroup!: FormGroup;

  isAddLoading: boolean = false;
  isRemoveLoading: boolean = false;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  examCenterId: any;

  constructor(
    private examCenterService: ExamCenterService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    this.examCenterId = this.dialogData?.examCenterId ?? 0;
    this.initFormGroup();
  }


  ngAfterViewInit(): void {
    if (this.isEditMode && this.dialogData) {
      const formData = JSON.parse(JSON.stringify(this.dialogData));
      formData['status'] = formData['status'] === '1' ? true : false;
      const children = this.dialogData?.children.map((item: any) => {
        const obj = {
          batchTimeSlotName: item?.batchTimeSlotName,
          batchTimeSlotId: item?.batchTimeSlotId,
          examCenterId: this.examCenterId ?? 0,
        }
        return obj;
      });
      delete formData.children;
      this.formGroup.patchValue(formData);
      setTimeout(() => {
        this.batchTimeSlotList.clear();
        children.forEach((item: any) => {
          const control = this.addFormArrayControl();
          control.patchValue(item);
          this.batchTimeSlotList.push(control);
        })

      })
      this.cdref.detectChanges();
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, ![Validators.required]],
      examCenterName: ['', [Validators.required]],
      batchTimeSlotList: this.isEditMode ? this.fb.array([]) : this.fb.array(
        [
          this.addFormArrayControl()
        ]
      )
    })
  }

  get batchTimeSlotList(): FormArray {
    return this.formGroup.get('batchTimeSlotList') as FormArray;
  }

  addFormArrayControl() {
    return this.fb.group({
      batchTimeSlotName: ['', [Validators.required]],
      batchTimeSlotId: ['', ![Validators.required]],
      examCenterId: [this.examCenterId, ![Validators.required]],
    })
  }

  handleAddItem() {
    this.batchTimeSlotList.push(this.addFormArrayControl());
  }

  handleRemoveItem(index: number) {
    this.batchTimeSlotList.removeAt(index);
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
    delete formVal.status;
    formVal['examCenterId'] = this.isEditMode ? this.examCenterId : 0;
    const batchTimeSlotList = formVal['batchTimeSlotList'].map((item: any) => {
      item['examCenterId'] = formVal['examCenterId'];
      item['batchTimeSlotId'] = item['batchTimeSlotId'] ? item['batchTimeSlotId'] : 0;
      item['batchTimeSlotName'] = item['batchTimeSlotName'];
      return item;
    });
    formVal['batchTimeSlotList'] = batchTimeSlotList;

    let apiCall = this.examCenterService.saveExamCenter(formVal);
    if (this.isEditMode) {
      apiCall = this.examCenterService.updateExamCenter(formVal, this.examCenterId);
    }

    apiCall.subscribe({
      next: (response) => {
        this.isSubmitActionLoading = false;
        setTimeout(() => {
          this.dialogRef.close(response);
          utils.isAddActionLoading.set(false);
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
