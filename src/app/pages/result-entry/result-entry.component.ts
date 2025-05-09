import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule, DropdownChangeEvent } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { BatchAllocationService } from '../../services/batch-allocation.service';
import { CompetitionService } from '../../services/competition/competition.service';
import { OfflineStudentService } from '../../services/offline-student.service';

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DataGridComponent,
    DropdownModule,
    PanelModule,
    ChipModule
  ],
  providers: [DialogService],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent {
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  isCompetitionListLoading: boolean = false;
  competitionList: any[] = [];
  selectedCompetition: string = '';
  isPanelCollapsed: boolean = false;
  selectedHallTicket: string = '';
  formSearch!: FormGroup;
  formLevels!: FormGroup;
  fullName: string = '';
  levelName: string = '';
  isSubmitActionLoading: boolean = false;
  showLevels: boolean = false;
  hallTicketNowiseInfo: any;
  showGrid: boolean = false;
  isRemoveLoading: boolean = false;

  constructor(
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private batchService: BatchAllocationService,
    private offlineService: OfflineStudentService,
  ) { }

  ngOnInit(): void {
    this.initFormGroups();
    this.getCompetitionList();
    this.formLevels = this.fb.group({
      roundGroups: this.fb.array([this.createRoundGroup()])
    });
  }

  initFormGroups() {
    this.formSearch = this.fb.group({
      competitionId: ['', [Validators.required]],
      hallTicketNo: ['', [Validators.required]],
    });

    this.formLevels = this.fb.group({
      level1: ['', [Validators.required]],
      level2: ['', [Validators.required]],
      level3: ['', [Validators.required]]
    });
  }


  get roundGroups(): FormArray {
    return this.formLevels.get('roundGroups') as FormArray;
  }

  createRoundGroup(): FormGroup {
    return this.fb.group({
      round1: ['', Validators.required],
      round2: ['', Validators.required],
      round3: ['', Validators.required]
    });
  }

  addRoundGroup(): void {
    this.roundGroups.push(this.createRoundGroup());
  }

  removeRoundGroup(index: number): void {
    this.roundGroups.removeAt(index);
  }


  getCompetitionList() {
    this.isCompetitionListLoading = true;
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList);
        }
        this.isCompetitionListLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isCompetitionListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.selectedCompetition = event.value;
    this.isSearchDisabled = this.selectedCompetition === '';
  }


  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'hallTicketNumber', header: 'Hall Ticket Number', width: '20%', styleClass: 'hallTicketNumber' },
      { field: 'levelId', header: 'Level Id', width: '20%', styleClass: 'levelId' },
      { field: 'compititionId', header: 'Compitition Id', width: '20%', styleClass: 'compititionId' },
      { field: 'round1Mark', header: 'Round 1', width: '10%', styleClass: 'round1Mark' },
      { field: 'round2Mark', header: 'Round 2', width: '10%', styleClass: 'round2Mark' },
      { field: 'round3Mark', header: 'Round 3', width: '10%', styleClass: 'round3Mark' },
      {
        field: 'action',
        header: 'Action',
        width: '20%',
        styleClass: 'action'
      }
    ];
  }

  handleSearchAction() {
    if (this.formSearch.valid) {
      this.isSearchActionLoading = true;
      const hallTicketNumber = this.formSearch.get('hallTicketNo')?.value;
      this.batchService.getStudentInfoHallTicketNoWise({ compititionId: this.selectedCompetition, hallTicketNumber }).subscribe({
        next: (response) => {
          this.hallTicketNowiseInfo = response;
          this.fullName = response?.studentFullName
          this.levelName = response?.levelName;
          this.isSearchActionLoading = false;
          this.formLevels.reset();
          this.showLevels = true;
        },
        error: (error: HttpErrorResponse) => {
          this.isSearchActionLoading = false;
          utils.setMessages(error.message, 'error');
        }
      });
    }
  }
  handleAddEditAction() {

  }
  handleFormLevelsAction() {
    if (this.formLevels.valid) {
      this.isSubmitActionLoading = true;

      const searchForm = this.formSearch.getRawValue();
      const formLevels = this.formLevels.getRawValue();
      const payload = {
        "studentOfflineMarkId": 0,
        "studentId": this.hallTicketNowiseInfo?.studentId,
        "levelId": this.hallTicketNowiseInfo?.levelId,
        "compititionId": searchForm?.competitionId,
        "hallTicketNumber": searchForm?.hallTicketNo,
        "round1Mark": formLevels.level1,
        "round2Mark": formLevels.level2,
        "round3Mark": formLevels.level3,
        "createdDate": new Date(),
      };
      forkJoin({
        saveMarkEntry: this.offlineService.saveOfflineStudentMarkEntry(payload),
        getStudentList: this.offlineService.getOfflineStudentListCompititionIdWise({
          compititionId: searchForm?.competitionId,
        }),
      }).subscribe({
        next: (results) => {
          this.isSubmitActionLoading = false;
          const saveMarkResponse = results.saveMarkEntry;
          const studentListResponse = results.getStudentList;
          utils.setMessages(saveMarkResponse.message, 'success');
          // console.log('Student List:', studentListResponse);
          this.tableDataSource = studentListResponse;
          this.setTableColumns();
          this.showGrid = true;
          if (this.tableDataSource.length > 0) this.isPanelCollapsed = true
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitActionLoading = false;
          utils.setMessages(error.message, 'error');
        },
      });
    }
  }
}
