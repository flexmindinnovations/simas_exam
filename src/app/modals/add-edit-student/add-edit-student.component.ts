import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { utils } from '../../utils';
import { StudentService } from '../../services/student/student.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { CompetitionService } from '../../services/competition/competition.service';

@Component({
  selector: 'app-add-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, PasswordModule, ImagePickerComponent],
  templateUrl: './add-edit-student.component.html',
  styleUrl: './add-edit-student.component.scss'
})
export class AddEditStudentComponent implements OnInit, AfterViewInit {

  dialogData: any;
  formGroup!: FormGroup;

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  levelListLoading: boolean = false;
  franchiseTypeNameListLoading: boolean = false;
  franchiseNameListLoading: boolean = false;
  instructorListLoading: boolean = false;

  examTypeNameList: Array<any> = [];
  levelNameList: Array<any> = [];
  franchiseTypeNameList: any[] = [];
  franchiseNameList: any[] = [];
  instructorList: any[] = [];
  competitionList: any[] = [];

  selectedFiles: File[] = [];
  selectedImagePath: string = '';

  maxDate = new Date();

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private franchiseService: FranchiseService,
    private levelService: LevelService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private competitionService: CompetitionService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.getPopupData();
  }

  ngAfterViewInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    if (this.isEditMode) {
      this.selectedImagePath = this.dialogData['studentPhoto'];
      this.dialogData['dob'] = new Date(this.dialogData['dob']);
      this.dialogData['status'] = this.dialogData['status'] === '1' ? true : false;
      this.formGroup.patchValue(this.dialogData);
    }
  }

  initFormGroup() {
    const uniquePassword = utils.generatePassword(6);
    this.formGroup = this.fb.group({
      status: [true, [Validators.required]],
      studentFirstName: ['', [Validators.required]],
      studentMiddleName: ['', [Validators.required]],
      studentLastName: ['', [Validators.required]],
      address1: [''],
      mobileNo: ['', [Validators.required, Validators.pattern(utils.mobileValidationPattern)]],
      userPassword: ['', [utils.optionalControlValidator]],
      dob: ['', [Validators.required]],
      standard: ['', [Validators.required]],
      schoolName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      // franchiseTypeId: ['', [Validators.required]],
      franchiseId: ['', [Validators.required]],
      levelId: ['', [Validators.required]],
      compititionId: ['', [Validators.required]],
      instructorId: ['', [Validators.required]],
      stuPass: [uniquePassword, [Validators.required]],
      levelName: [''],
      // franchiseTypeName: ['', [Validators.required]],
      franchiseName: [''],
      instructorName: [''],
      // startDate: ['', [Validators.required]],
      // endDate: ['', [Validators.required]]
    });
  }

  handleUploadFile(event: any) {
    const eventType = event?.event;
    this.selectedFiles = event?.files;
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

  getPopupData() {
    this.levelListLoading = true;
    this.franchiseTypeNameListLoading = true;
    this.franchiseNameListLoading = true;
    this.instructorListLoading = true;
    const franchiseList = this.franchiseService.getFranchiseByTypeList('1');
    const levelList = this.levelService.getLevelList();
    const instructorList = this.instructorService.getInstructorList();
    const competitionList = this.competitionService.getCompetitionList();
    forkJoin({ franchiseList, levelList, instructorList, competitionList }).subscribe({
      next: (response) => {
        if (response) {
          const { franchiseList, levelList, instructorList, competitionList } = response;
          this.levelNameList = levelList;
          this.franchiseNameList = franchiseList;
          this.instructorList = instructorList;
          this.competitionList = competitionList;

          this.levelListLoading = false;
          this.franchiseNameListLoading = false;
          this.franchiseNameListLoading = false;
          this.instructorListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.levelListLoading = false;
        this.franchiseNameListLoading = false;
        this.franchiseNameListLoading = false;
        this.instructorListLoading = false;
      }
    })
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    const formData = new FormData();
    if (this.isEditMode) formVal['studentId'] = this.dialogData?.studentId;
    // const startDate = new Date(formVal['startDate']).toISOString();
    // const endDate = new Date(formVal['endDate']).toISOString();
    const dob = new Date(formVal['dob']).toISOString();
    const status = formVal['status'];
    // formVal['franchiseTypeId'] = 1;
    // formVal['startDate'] = startDate;
    // formVal['endDate'] = endDate;
    formVal['dob'] = dob;
    formVal['userPassword'] = formVal['stuPass'];
    formVal['status'] = status === true ? '1' : '0';
    formData.append('studentModel', JSON.stringify(formVal));
    if (this.selectedFiles?.length) {
      formData.append('file', this.selectedFiles[0], this.selectedFiles[0].name);
    }
    let apiCall = this.studentService.saveStudent(formVal);
    if (this.selectedFiles?.length) {
      formVal['studentPhoto'] = this.selectedFiles[0].name;
      apiCall = this.studentService.uploadStudentDetails(formData);
    }
    if (this.isEditMode && this.selectedFiles?.length) {
      formVal['studentPhoto'] = this.selectedFiles[0].name;
      apiCall = this.studentService.uploadAndUpdateStudent(formData);
    }
    if (this.isEditMode && !this.selectedFiles?.length) {
      formVal['studentPhoto'] = this.selectedImagePath;
      apiCall = this.studentService.updateStudent(formVal);
    }
    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
        setTimeout(() => {
          this.dialogRef.close(res);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
        utils.setMessages(error.message, 'error');
        this.dialogRef.close(false);
      }
    })
  }
}
