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

  constructor(
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private batchService: BatchAllocationService
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

  handleSearchAction() {
    if (this.formSearch.valid) {
      this.isSearchActionLoading = true;
      const hallTicketNumber = this.formSearch.get('hallTicketNo')?.value;
      this.batchService.getStudentInfoHallTicketNoWise({ compititionId: this.selectedCompetition, hallTicketNumber }).subscribe({
        next: (response) => {
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
  handleFormLevelsAction() {
    if (this.formLevels.valid) {
      this.isSubmitActionLoading = true;
      setTimeout(() => {
        this.isSubmitActionLoading = false;
      }, 2000);
    }
  }
}
