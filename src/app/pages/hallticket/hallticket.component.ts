import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { HallticketService } from '../../services/hallticket/hallticket.service';

@Component({
  selector: 'app-hallticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
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
  isBatchTimeLoading: boolean = false;
  selectedFranchise: string = '';
  instructorList: any[] = [];
  examCenterList: any[] = [];
  batchTimeList: any[] = [];
  selectedInstructor: string = '';
  selectedExamCenter: string = '';
  selectedBatchTime: string = '';
  isPanelCollapsed: boolean = false;
  formGroup!: FormGroup;
  hallTicketList: any[] = [];
  showGrid: boolean = false;

  constructor(
    private franchiseService: FranchiseService,
    private instructorService: InstructorService,
    private examCenterService: ExamCenterService,
    private hallticketService: HallticketService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.initFormGroup();
    this.getFranchiseList();
    this.getExamCenterList();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      franchiseId: ['', [Validators.required]],
      instructorId: ['', [Validators.required]],
      examCenterId: ['', [Validators.required]],
      batchTimeSlotId: ['', [Validators.required]]
    })
  }

  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'studentFullName', header: 'Full Name', width: '30%', styleClass: 'studentFullName' },
      { field: 'instructorName', header: 'Instructor', width: '30%', styleClass: 'instructorName' },
      // { field: 'franchiseName', header: 'Franchise', width: '20%', styleClass: 'franchiseName' },
      { field: 'levelName', header: 'Level', width: '30%', styleClass: 'levelName' },
      // { field: 'mobileNo', header: 'Mobile Number', width: '10%', styleClass: 'mobileNo' },
      // { field: 'status', header: 'Status', width: '20%', styleClass: 'status' },
      // { field: 'studentLastName', header: 'Last Name', width: '20%', styleClass: 'studentLastName' },
      // { field: 'emailId', header: 'Email', width: '15%', styleClass: 'emailId' },
      // { field: 'dob', header: 'DOB', width: '10%', styleClass: 'dob' },
      // { field: 'schoolName', header: 'School Name', width: '20%', styleClass: 'schoolName' },
      // { field: 'standard', header: 'Standard', width: '20%', styleClass: 'Standard' },
      // { field: 'franchiseTypeName', header: 'Franchise Type', width: '15%', styleClass: 'franchiseTypeName' },
      {
        field: 'action',
        header: 'Action',
        width: '20%',
        styleClass: 'action'
      }
    ];
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
  getInstructorList(franchiseId: any) {
    this.isInstructorListLoading = true;
    this.instructorService.getInstructorListByFranchiseId(franchiseId).subscribe({
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
  getExamCenterList() {
    utils.isTableLoading.set(true);
    const apiCall = this.examCenterService.getExamCenterList();
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.examCenterList = response;
          // this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examCenterList);
          this.examCenterList = response.map((item: any) => {
            const children = item?.batchTimeSlotList.filter((child: any) => child.examCenterId === item?.examCenterId);
            item['children'] = children;
            delete item['batchTimeSlotList'];
            return item;
          })
          utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          utils.setMessages(error.message, 'error');
          utils.isTableLoading.update(val => !val);
        }
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
    this.getInstructorList(event?.value);
  }
  handleAddEditAction() {

  }
  handleSearchAction() {
    this.setTableColumns();
    utils.isTableLoading.set(true);
    if (this.formGroup.valid) {
      this.hallticketService.getStudentHallTicketList(this.formGroup.value).subscribe({
        next: (respones) => {
          if (respones) {
            // console.log(respones);
            this.hallTicketList = respones;
            // this.hallTicketList = respones.map((item: any) => {
            //   item['fullName'] = item['studentFirstName'] + " " + item['studentLastName'];
            //   return item;
            // });
            this.tableDataSource = this.hallTicketList;
            this.showGrid = this.tableDataSource.length > 1 ? true : false;
            utils.isTableLoading.update(val => !val);
          }
        },
        error: (error: HttpErrorResponse) => {
          utils.setMessages(error.message, 'error');
          utils.isTableLoading.update(val => !val);
        }
      })
    }
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
  handleOnExamCenterChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedExamCenter !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
    this.batchTimeList = this.examCenterList.filter((child: any) => child?.examCenterId === event?.value)[0]?.children;
  }

  handleOnBatchTimeChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedExamCenter !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
}
