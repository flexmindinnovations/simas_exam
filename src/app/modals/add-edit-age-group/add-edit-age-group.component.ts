import { ChangeDetectorRef, Component } from '@angular/core';
import { utils } from '../../utils';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { CompetitionService } from '../../services/competition/competition.service';
import { DropdownModule } from 'primeng/dropdown';
import { AgeGroupService } from '../../services/age-group/age-group.service';

@Component({
  selector: 'app-add-edit-age-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CalendarModule, InputSwitchModule, DropdownModule,],
  templateUrl: './add-edit-age-group.component.html',
  styleUrl: './add-edit-age-group.component.scss'
})
export class AddEditAgeGroupComponent {
  dialogData: any;
  formGroup!: FormGroup;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  inputId = new Date().getTime() + utils.getRandomNumber();
  competitionList: any[] = [];
  selectedCompetiton: string = '';

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private ageGroupService: AgeGroupService,
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.getCompetitionList();
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData.isEditMode;
  }


  ngAfterViewInit(): void {
    const data = this.dialogData;
    if (this.isEditMode && data) {
      data['startDate'] = data['startDate'] ? new Date(data['startDate']) : new Date();
      data['endDate'] = data['endDate'] ? new Date(data['endDate']) : new Date();
      this.formGroup.patchValue(data);
      this.cdref.detectChanges();
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      compititionId: ['', [Validators.required]],
      ageGroupName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }

  getCompetitionList() {
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  getCompetitionName(formVal: any) {
    const compititionName = this.competitionList?.filter(item => item.compititionId === formVal.compititionId);
    return compititionName[0]?.compititionName;
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['compititionName'] = this.getCompetitionName(formVal);
    formVal['ageGroupId'] = this.dialogData['ageGroupId'] ? this.dialogData['ageGroupId'] : 0;
    const startDate = new Date(formVal['startDate']).toISOString();
    const endDate = new Date(formVal['endDate']).toISOString();
    formVal['startDate'] = startDate;
    formVal['endDate'] = endDate;

    let apiCall = this.ageGroupService.saveAgeGroup(formVal);
    if (this.isEditMode) {
      apiCall = this.ageGroupService.updateAgeGroup(formVal);
    }
    apiCall.subscribe({
      next: (response: any) => {
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
