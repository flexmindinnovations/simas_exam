import { Component, OnInit } from '@angular/core';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule, DropdownChangeEvent } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { utils } from '../../utils';
import { CompetitionService } from '../../services/competition/competition.service';
import { BatchAllocationService } from '../../services/batch-allocation.service';
import { OfflineStudentService } from '../../services/offline-student.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-result',
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
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.scss']
})
export class StudentResultComponent implements OnInit {
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
  roundTotal: number = 0;
  ageGroup: string = '';
  bonusMarks: number = 0;


  constructor(
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private batchService: BatchAllocationService,
    private offlineService: OfflineStudentService,
  ) { }

  ngOnInit(): void {
    this.initFormGroups();
    this.getCompetitionList();
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

  getTotal(): number {
    const l1 = Number(this.formLevels.get('level1')?.value) || 0;
    const l2 = Number(this.formLevels.get('level2')?.value) || 0;
    const l3 = Number(this.formLevels.get('level3')?.value) || 0;
    return Math.round(l1 + l2 + l3);
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
          this.fullName = response?.studentFullName ? response?.studentFullName : "-"
          this.levelName = response?.levelName ? response?.levelName : "-";
          this.ageGroup = response?.ageGroupName ? response?.ageGroupName : "-";
          this.bonusMarks = response?.bonusMarks ? response.bonusMarks : "-"
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
        "examMode": "Offline"
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
