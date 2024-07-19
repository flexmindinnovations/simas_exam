import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-add-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, PasswordModule, ImagePickerComponent],
  templateUrl: './add-edit-student.component.html',
  styleUrl: './add-edit-student.component.scss'
})
export class AddEditStudentComponent implements OnInit {

  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  levelListLoading: boolean = false;
  franchiseTypeNameListLoading: boolean = false;
  franchiseNameListLoading: boolean = false;
  instructorListLoading: boolean = false;

  levelList: any[] = [];
  franchiseTypeNameList: any[] = [];
  franchiseNameList: any[] = [];
  instructorList: any[] = [];

  selectedFiles: File[] = [];
  selectedImagePath: string = '';

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
      status: ['', [Validators.required]],
      studentFirstName: ['', [Validators.required]],
      studentLastName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required]],
      standard: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      schoolName: ['', [Validators.required]],
      levelName: ['', [Validators.required]],
      franchiseTypeName: ['', [Validators.required]],
      franchiseName: ['', [Validators.required]],
      instructorName: ['', [Validators.required]],
      address1: ['', [Validators.required]]
    });
  }

  handleUploadFile(event: any) {
    const eventType = event?.event;
    this.selectedFiles = event?.files;
    if (eventType === 'onSelectedFiles') {

    } else {

    }
  }

  isNumberKey(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  handleOnLevelChange(event: DropdownChangeEvent) {

  }

  handleOnFranchiseTypeNameChange(event: DropdownChangeEvent) {

  }

  handleOnFranchiseNameChange(event: DropdownChangeEvent) {

  }

  handleOnInstructorNameChange(event: DropdownChangeEvent) {

  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {

  }
}
