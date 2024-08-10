import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { utils } from '../../utils';
import { ActivationType } from '../../pages/activation/activation.component';
import { CompetitionService } from '../../services/competition/competition.service';

@Component({
  selector: 'app-add-edit-competition',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CalendarModule, InputSwitchModule],
  templateUrl: './add-edit-competition.component.html',
  styleUrl: './add-edit-competition.component.scss'
})
export class AddEditCompetitionComponent {
  dialogData: any;
  formGroup!: FormGroup;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  inputId = new Date().getTime() + utils.getRandomNumber();

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData.isEditMode;
  }

  ngAfterViewInit(): void {
    const data = this.dialogData;
    if (this.isEditMode && data) {
      data['compititionDate'] = data['compititionDate'] ? new Date(data['compititionDate']) : new Date();
      data['status'] = data['status'] === '1' ? true : false;
      this.formGroup.patchValue(data);
      this.cdref.detectChanges();
    }
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, ![Validators.required]],
      compititionName: ['', [Validators.required]],
      compititionDate: ['', [Validators.required]],
    })
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    formVal['compititionId'] = this.dialogData['compititionId'] ? this.dialogData['compititionId'] : 0;
    const compititionDate = new Date(formVal['compititionDate']).toISOString();
    formVal['status'] = formVal['status'] ? '1' : '0';
    formVal['compititionDate'] = compititionDate;

    let apiCall = this.competitionService.SaveCompetition(formVal);
    if (this.isEditMode) apiCall = this.competitionService.updateCompetition(formVal);
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
