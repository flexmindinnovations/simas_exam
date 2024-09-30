import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from 'xlsx';

@Component({
  selector: 'app-hallticket',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DropdownModule, DataGridComponent],
  templateUrl: './hallticket.component.html',
  styleUrl: './hallticket.component.scss'
})
export class HallticketComponent {
  colDefs: any[] = [];
  tableDataSource: any[] = [];
  franchiseList: any[] = [];
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  isFranchiseListLoading: boolean = false;
  isInstructorListLoading: boolean = false;
  isExamCenterLoading: boolean = false;
  selectedFranchise: string = '';
  instructorList: any[] = [];
  examCenterList: any[] = [];
  selectedInstructor: string = '';
  selectedExamCenter: string = '';


  constructor(
    private franchiseService: FranchiseService,
    private instructorService: InstructorService,
  ) {

  }

  ngOnInit(): void {
    this.getFranchiseList();
    this.getInstructorList();
    const instructorList = this.instructorService.getInstructorList();
  }

  getFranchiseList() {
    this.isFranchiseListLoading = true;
    this.franchiseService.getFranchiseByTypeList('1').subscribe({
      next: (response) => {
        if (response) {
          this.franchiseList = response;
          this.isFranchiseListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isFranchiseListLoading = false;
        // utils.setMessages(error.message, 'error');
      }
    })

  }
  getInstructorList() {
    this.isInstructorListLoading = true;
    this.instructorService.getInstructorList().subscribe({
      next: (response) => {
        if (response) {
          this.instructorList = response;
          this.isInstructorListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isInstructorListLoading = false;
        // utils.setMessages(error.message, 'error');
      }
    })
  }
  handleOnFranchiseChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedFranchise !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
  handleAddEditAction() {

  }
  handleSearchAction() {

  }
  handleOnInstructorNameChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedInstructor !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
  handleOnExamCanterChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedExamCenter !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
}
