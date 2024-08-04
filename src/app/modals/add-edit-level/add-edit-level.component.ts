import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { utils } from '../../utils';
import { FormBuilder, FormGroup, FormsModule, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedService } from '../../services/shared/shared.service';
import { TooltipModule } from 'primeng/tooltip';
import { LevelService } from '../../services/level/level.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-edit-level',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, TooltipModule],
  templateUrl: './add-edit-level.component.html',
  styleUrl: './add-edit-level.component.scss'
})
export class AddEditLevelComponent implements OnInit, AfterViewInit {

  dialogData: any;
  formGroup!: FormGroup;

  isAddLoading: boolean = false;
  isRemoveLoading: boolean = false;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private levelService: LevelService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    if (this.isEditMode && this.dialogData) {
      const formData = JSON.parse(JSON.stringify(this.dialogData));
      formData['status'] = formData['status'] === '1' ? true : false;
      const children = this.dialogData?.children.map((item: any) => {
        const roundTime = item?.examRoundTime?.split(':');
        const obj = {
          roundName: item?.roundName,
          numberOfQuestion: item?.numberOfQuestion,
          questionTimeInSeconds: roundTime.length ? roundTime[0] : 0,
          questionTimeInMS: roundTime.length ? roundTime[1] : 0
        }
        return obj;
      });
      delete formData.children;
      this.formGroup.patchValue(formData);
      setTimeout(() => {
        this.questions.clear();
        children.forEach((item: any) => {
          const control = this.addFormArrayControl();
          control.patchValue(item);
          this.questions.push(control);
        })

      })
      this.cdref.detectChanges();
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, ![Validators.required]],
      levelName: ['', [Validators.required]],
      examRoundList: this.isEditMode ? this.fb.array([]) : this.fb.array(
        [
          this.addFormArrayControl()
        ]
      )
    })
  }

  get questions(): FormArray {
    return this.formGroup.get('examRoundList') as FormArray;
  }

  addFormArrayControl() {
    return this.fb.group({
      roundName: ['', [Validators.required]],
      numberOfQuestion: ['', [Validators.required]],
      questionTimeInSeconds: ['', [Validators.required, utils.rangeValidator(0, 60)]],
      questionTimeInMS: ['', [Validators.required, utils.rangeValidator(0, 60)]]
    })
  }

  handleAddItem() {
    this.questions.push(this.addFormArrayControl());
  }

  handleRemoveItem(index: number) {
    this.questions.removeAt(index);
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
    formVal['levelId'] = this.isEditMode ? this.dialogData?.levelId : 0;
    const examRoundList = formVal['examRoundList'].map((item: any) => {
      item['examRoundTime'] = `${item['questionTimeInSeconds']}:${item['questionTimeInMS']}`;
      item['levelId'] = formVal['levelId'];
      item['roundId'] = item['roundId'] ? item['roundId'] : 0;
      delete item['questionTimeInSeconds'];
      delete item['questionTimeInMS'];
      return item;
    });
    formVal['examRoundList'] = examRoundList;
    delete formVal['status'];

    let apiCall = this.levelService.saveLevel(formVal);
    if (this.isEditMode) {
      apiCall = this.levelService.updateLevel(formVal);
    }

    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        setTimeout(() => {
          this.dialogRef.close(res);
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
