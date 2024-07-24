import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-add-edit-level',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, TooltipModule],
  templateUrl: './add-edit-level.component.html',
  styleUrl: './add-edit-level.component.scss'
})
export class AddEditLevelComponent implements OnInit {

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
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, ![Validators.required]],
      levelName: ['', [Validators.required]],
      noOfQuestions: ['', [Validators.required]],
      questions: this.fb.array(
        [
          this.addFormArrayControl()
        ]
      )
    })
  }

  get questions(): FormArray {
    return this.formGroup.get('questions') as FormArray;
  }

  addFormArrayControl() {
    return this.fb.group({
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
    if(this.formGroup.invalid) {
      const invalidControls = utils.getInvalidControls(this.formGroup);
      return;
    }
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();

    console.log('formVal: ', formVal);
    

  }

}
