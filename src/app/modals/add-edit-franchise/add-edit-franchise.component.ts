import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { utils } from '../../utils';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country } from '../../interfaces/Country';
import { State } from '../../interfaces/State';
import { City } from '../../interfaces/City';
import { SharedService } from '../../services/shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ImagePickerComponent } from '../../components/image-picker/image-picker.component';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-add-edit-franchise',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextareaModule, PasswordModule, ImagePickerComponent],
  templateUrl: './add-edit-franchise.component.html',
  styleUrl: './add-edit-franchise.component.scss'
})
export class AddEditFranchiseComponent implements OnInit, AfterViewInit {

  dialogData: any;
  formGroup!: FormGroup;

  countryList: Array<Country> = [];
  stateList: Array<State> = [];
  cityList: Array<City> = [];

  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  countryListLoading: boolean = false;
  stateListLoading: boolean = false;
  cityListLoading: boolean = false;
  selectedFiles: File[] = [];
  selectedImagePath: string = '';

  inputId = new Date().getTime() + utils.getRandomNumber();

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private franchiseService: FranchiseService,
    private cdref: ChangeDetectorRef
  ) {

    effect(() => {
      const countryList = utils.countryData();
      if (countryList?.length) {
        this.countryList = countryList;
      } else {
        this.getCountryList();
      }
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
  }

  ngAfterViewInit(): void {
    if (this.isEditMode && this.dialogData) {
      const formData = JSON.parse(JSON.stringify(this.dialogData));
      formData['status'] = formData['status'] === '1' ? true : false;
      formData['joiningDate'] = new Date(formData['joiningDate']);
      formData['startDate'] = new Date(formData['startDate']);
      formData['endDate'] = new Date(formData['endDate']);
      this.selectedImagePath = formData?.logoPath;
      this.formGroup.patchValue(formData);
      this.cdref.detectChanges();
    }
  }

  handleUploadFile(event: any) {
    const eventType = event?.event;
    this.selectedFiles = event?.files;
    if (eventType === 'onSelectedFiles') {

    } else {

    }
  }

  getCountryList() {
    this.countryListLoading = true;
    this.sharedService.getCountryList().subscribe({
      next: (response: Array<Country>) => {
        this.countryList = response;
        this.countryListLoading = false;
        this.formGroup.get('stateId')?.disable();
        this.formGroup.get('cityId')?.disable();
        if (this.isEditMode && this.dialogData) {
          const countryId = this.dialogData?.countryId;
          this.getStateList(countryId);
          this.formGroup.patchValue(
            { countryId: countryId }
          )
        }
      },
      error: (error: HttpErrorResponse) => {
        this.countryListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    })
  }

  getStateList(countryId: number) {
    this.stateListLoading = true;
    this.sharedService.getStateList(countryId).subscribe({
      next: (response: Array<State>) => {
        this.stateList = response;
        this.stateListLoading = false;
        this.formGroup.get('stateId')?.enable();
        if (this.isEditMode && this.dialogData) {
          const stateId = this.dialogData?.stateId;
          this.getCityList(stateId);
          this.formGroup.patchValue(
            { stateId: stateId }
          )
        }
      },
      error: (error: HttpErrorResponse) => {
        this.stateListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    })
  }

  getCityList(stateId: number) {
    this.cityListLoading = true;
    this.sharedService.getCityList(stateId).subscribe({
      next: (response: Array<City>) => {
        this.cityList = response;
        this.cityListLoading = false;
        this.formGroup.get('cityId')?.enable();
        if (this.isEditMode && this.dialogData) {
          const cityId = this.dialogData?.cityId;
          this.formGroup.patchValue(
            { cityId: cityId }
          )
        }
      },
      error: (error: HttpErrorResponse) => {
        this.cityListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      franchiseName: ['', [Validators.required]],
      ownerName: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      // userPassword: ['', [Validators.required]],
      franchiseePassword: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern(utils.mobileValidationPattern), Validators.maxLength(14)]],
      status: !['', [Validators.required]],
      // startDate: ['', [Validators.required]],
      // endDate: ['', [Validators.required]]
    });
  }

  handleOnCountryListChange(event: DropdownChangeEvent) {
    const { countryId, countryName } = event?.value;
    this.stateList = [];
    this.cityList = [];
    // this.getStateList(countryId);
    this.getStateList(event?.value);
  }

  handleOnStateListChange(event: DropdownChangeEvent) {
    this.cityList = [];
    this.formGroup.get('cityId')?.disable();
    const {
      stateId,
      countryId,
      stateName,
      countryName
    } = event?.value;
    // this.getCityList(stateId);
    this.getCityList(event?.value);
  }

  handleOnCityListChange(event: DropdownChangeEvent) {
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    const countryId = formVal['countryId']['countryId'];
    const stateId = formVal['stateId']['stateId'];
    const cityId = formVal['cityId']['cityId'];

    const formData = new FormData();
    if (this.isEditMode) formVal['franchiseId'] = this.dialogData?.franchiseId;
    const joiningDate = new Date(formVal['joiningDate']).toISOString();
    // const startDate = new Date(formVal['startDate']).toISOString();
    // const endDate = new Date(formVal['endDate']).toISOString();
    const status = formVal['status'];
    formVal['franchiseTypeId'] = 1;
    formVal['joiningDate'] = joiningDate;
    // formVal['startDate'] = startDate;
    // formVal['endDate'] = endDate;
    formVal['countryId'] = countryId;
    formVal['stateId'] = stateId;
    formVal['cityId'] = cityId;
    formVal['userPassword'] = formVal['franchiseePassword'];
    formVal['logoPath'] = this.dialogData?.logoPath;
    formVal['status'] = status === true ? '1' : '0';
    formData.append('franchiseModel', JSON.stringify(formVal));
    if (this.selectedFiles?.length) {
      formData.append('file', this.selectedFiles[0], this.selectedFiles[0].name);
    }
    let apiCall = this.franchiseService.saveFranchinse(formVal);
    if (this.selectedFiles?.length) {
      apiCall = this.franchiseService.uploadAndSaveFranchinse(formData);
    }
    if (this.isEditMode && this.selectedFiles?.length) {
      apiCall = this.franchiseService.uploadAndUpdateFranchinse(formData);
    }
    if (this.isEditMode && !this.selectedFiles?.length) {
      apiCall = this.franchiseService.updateFranchinse(formVal);
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
}
