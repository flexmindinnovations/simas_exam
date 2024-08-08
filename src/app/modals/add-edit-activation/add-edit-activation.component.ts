import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { utils } from '../../utils';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivationType } from '../../pages/activation/activation.component';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ActivationService } from '../../services/activation/activation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-activation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CalendarModule, InputSwitchModule],
  templateUrl: './add-edit-activation.component.html',
  styleUrl: './add-edit-activation.component.scss'
})
export class AddEditActivationComponent implements OnInit, AfterViewInit {
  dialogData: any;
  formGroup!: FormGroup;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  activationType = ActivationType;
  inputId = new Date().getTime() + utils.getRandomNumber();
  fieldGroupOrder: any[] = [];
  objectId: any;
  objectType: any;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private activationService: ActivationService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData.isEditMode;
    if (this.dialogData) {
      if (this.dialogData.activationType === this.activationType.Franchise) {
        this.fieldGroupOrder = ['status', 'ownerName', 'franchiseName', 'startDate', 'endDate'];
        this.objectId = this.dialogData['franchiseId'];
        this.createFranchiseFormGroup();
      } else if (
        this.dialogData.activationType === this.activationType.Student
      ) {
        this.fieldGroupOrder = ['status', 'studentFirstName', 'studentMiddleName', 'studentLastName', 'franchiseName', 'startDate', 'endDate'];
        this.objectId = this.dialogData['studentId'];
        this.createStudentFormGroup();
      } else {
        this.fieldGroupOrder = ['status', 'instructorName', 'franchiseName', 'startDate', 'endDate'];
        this.objectId = this.dialogData['instructorId'];
        this.createInstructorFormGroup();
      }
      this.objectType = this.dialogData.activationType;
    }
  }

  ngAfterViewInit(): void {
    const data = this.dialogData;
    if (this.isEditMode && data) {
      data['startDate'] = data['startDate'] ? new Date(data['startDate']) : new Date();
      data['endDate'] = data['endDate'] ? new Date(data['endDate']) : new Date();
      data['status'] = data['status'] === '1' ? true : false;
      this.formGroup.patchValue(data);
      this.cdref.detectChanges();
    }
  }

  createFranchiseFormGroup() {
    const object = {
      status: this.dialogData?.status,
      franchiseName: this.dialogData?.franchiseName,
      ownerName: this.dialogData?.ownerName,
      startDate: this.dialogData?.startDate,
      endDate: this.dialogData?.endDate
    }
    const formGroup = this.createFormGroup(object);
    this.formGroup = formGroup;
  }
  createStudentFormGroup() {
    const object = {
      status: this.dialogData?.status,
      studentFirstName: this.dialogData?.studentFirstName,
      studentMiddleName: this.dialogData?.studentMiddleName,
      studentLastName: this.dialogData?.studentLastName,
      franchiseName: this.dialogData?.franchiseName,
      startDate: this.dialogData?.startDate,
      endDate: this.dialogData?.endDate
    }
    const formGroup = this.createFormGroup(object);
    this.formGroup = formGroup;
  }
  createInstructorFormGroup() {
    const object = {
      status: this.dialogData?.status,
      instructorName: this.dialogData?.instructorName,
      franchiseName: this.dialogData?.franchiseName,
      startDate: this.dialogData?.startDate,
      endDate: this.dialogData?.endDate
    }
    const formGroup = this.createFormGroup(object);
    this.formGroup = formGroup;
  }

  createFormGroup(data: any) {
    let formGroup = this.fb.group({});
    Object.keys(data).forEach(key => {
      let value = data[key];
      if (key === 'status') {
        value = (value === '1' || value === 1);
      }
      formGroup.addControl(key, new FormControl(value));
    });
    return formGroup;
  }

  getLabelName(key: string) {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return utils.addSpaceBetweenWords(label);
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['activationId'] = this.dialogData['activationId'] ? this.dialogData['activationId'] : 0;
    const startDate = new Date(formVal['startDate']).toISOString();
    const endDate = new Date(formVal['endDate']).toISOString();
    formVal['status'] = formVal['status'] ? '1' : '0';
    formVal['objectId'] = this.objectId ? this.objectId : 0;
    formVal['objectType'] = this.objectType;
    formVal['startDate'] = startDate;
    formVal['endDate'] = endDate;

    let apiCall = this.activationService.saveActivation(formVal);
    if (this.isEditMode) apiCall = this.activationService.updateActivation(formVal);
    apiCall.subscribe({
      next: (response) => {
        if (response) {
          setTimeout(() => {
            this.dialogRef.close(response);
          })
        }
      },
      error: (error: HttpErrorResponse) => {
        this.dialogRef.close(false);
        utils.setMessages(error.message, 'error');
      }
    })
  }
}
