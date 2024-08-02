import { SharedService } from './../../services/shared/shared.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ImagePickerComponent } from '../../components/image-picker/image-picker.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InstructorService } from '../../services/instructor/instructor.service';
import { utils } from '../../utils';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, PasswordModule, ImagePickerComponent],
  templateUrl: './add-edit-instructor.component.html',
  styleUrl: './add-edit-instructor.component.scss',
  animations: [utils.heightIncrease]
})
export class AddEditInstructorComponent implements OnInit, AfterViewInit {

  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  isFranchiseTypeNameListLoading: boolean = false;
  isFranchiseNameListLoading: boolean = false;

  franchiseTypeList: Array<any> = [];
  franchiseListByType: Array<any> = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private sharedService: SharedService,
    private cdref: ChangeDetectorRef
  ) {

    effect(() => {

    })
  }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;

    setTimeout(() => {
      utils.isAddActionLoading.set(false);
      utils.isTableEditAction.set(false);
    })
    this.initFormGroup();
    const selectedFranchise = 1;
    this.getFranchiseListByType(selectedFranchise);
  }

  ngAfterViewInit(): void {
    if (this.isEditMode && this.dialogData) {
      const formData = JSON.parse(JSON.stringify(this.dialogData));
      formData['status'] = formData['status'] === '1' ? true : false;
      formData['startDate'] = new Date(formData['startDate']);
      formData['endDate'] = new Date(formData['endDate']);
      this.formGroup.patchValue(formData);
      this.cdref.detectChanges();
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      // franchiseName: ['', [Validators.required]],
      instructorName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required]],
      instructorPassword: ['', [Validators.required]],
      // franchiseTypeId: ['', [Validators.required]],
      franchiseId: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern(utils.mobileValidationPattern), Validators.maxLength(14)]],
      status: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  getFranchiseList() {
    this.isFranchiseTypeNameListLoading = true;
    this.sharedService.getFranchiseTypeList().subscribe({
      next: (respones) => {
        if (respones) {
          this.franchiseListByType = respones;
          console.log('franchiseListByType: ', this.franchiseListByType);

          this.isFranchiseTypeNameListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.isFranchiseTypeNameListLoading = false;
      }
    })
  }

  getFranchiseListByType(franchiseTypeId: number) {
    this.isFranchiseNameListLoading = true;
    this.sharedService.getFranchiseListByType(franchiseTypeId).subscribe({
      next: (respones) => {
        if (respones) {
          this.franchiseListByType = respones;
          this.isFranchiseNameListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.isFranchiseNameListLoading = false;
      }
    })
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleOnFranchiseTypeNameChange(event: DropdownChangeEvent) {
    this.getFranchiseListByType(event?.value);
  }

  handleOnFranchiseNameChange(event: any) {

  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['instructorId'] = this.isEditMode ? this.dialogData?.instructorId : 0;
    const formData = new FormData();
    const startDate = new Date(formVal['startDate']).toISOString();
    const endDate = new Date(formVal['endDate']).toISOString();
    const status = formVal['status'];
    formVal['startDate'] = startDate;
    formVal['endDate'] = endDate;
    formVal['franchiseTypeId'] = 1;
    formVal['franchiseTypeName'] = '';
    formVal['mobileNo'] = formVal['mobileNo'].toString();
    formVal['status'] = status === true ? '1' : '0';
    console.log('formVal: ', formVal);

    formData.append('instructorModel', JSON.stringify(formVal));
    let apiCall = this.instructorService.saveInstructor(formVal);
    if (this.isEditMode) {
      apiCall = this.instructorService.updateInstructor(formVal);
    }
    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        utils.setMessages('Instructor added successfully', 'success');
        utils.isAddActionLoading.set(false);
        setTimeout(() => {
          this.dialogRef.close(res);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        utils.setMessages(error.message, 'error');
        this.dialogRef.close(false);
      }
    });
  }
}
