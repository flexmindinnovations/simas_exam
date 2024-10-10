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

@Component({
  selector: 'app-student-result',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
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
  formGroup!: FormGroup;

  constructor(
    private competitionService: CompetitionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.getCompetitionList();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      competitionId: ['', [Validators.required]],
      hallTicketNo: ['', [Validators.required]],
    });
  }

  getCompetitionList() {
    this.isCompetitionListLoading = true;
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
          // Assuming you want to set tableDataSource after receiving the competition list
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList);
        }
        this.isCompetitionListLoading = false; // Move this here to ensure it's called in both success and error cases
      },
      error: (error: HttpErrorResponse) => {
        this.isCompetitionListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.colDefs = []; // Reset column definitions if needed
    this.tableDataSource = []; // Reset table data source
    this.selectedCompetition = event.value;
    this.isSearchDisabled = this.selectedCompetition === ''; // Update search button disabled state
  }

  handleSearchAction() {
    if (this.formGroup.valid) {
      this.isSearchActionLoading = true;
      setTimeout(() => {
        this.isSearchActionLoading = false;
        // Here you can perform any actions after the search, like fetching results
      }, 2000);
    }
  }
}
