import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { utils } from '../../utils';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { StudentService } from '../../services/student/student.service';
import { Student } from '../../interfaces/Student';
import { CompetitionService } from '../../services/competition/competition.service';
import { BatchAllocationService } from '../../services/batch-allocation.service';

@Component({
  selector: 'app-batch-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
  templateUrl: './batch-allocation.component.html',
  styleUrl: './batch-allocation.component.scss'
})
export class BatchAllocationComponent {
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  franchiseList: any[] = [];
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  isFranchiseListLoading: boolean = false;
  isExamCenterLoading: boolean = false;
  isBatchTimeLoading: boolean = false;
  isCompetitionListLoading: boolean = false;
  isAllocateActionLoading: boolean = false;
  selectedFranchise: string = '';
  examCenterList: any[] = [];
  batchTimeList: any[] = [];
  competitionList: any[] = [];
  selectedExamCenter: string = '';
  selectedBatchTime: string = '';
  selectedCompetiton: string = '';
  isPanelCollapsed: boolean = false;
  studentList: Array<Student> = [];
  franchiseId: string = '';
  showGrid: boolean = false;
  studentBatchAllocationList: any;
  validAllocate: boolean = false;


  constructor(
    private franchiseService: FranchiseService,
    private examCenterService: ExamCenterService,
    private studentService: StudentService,
    private competitionService: CompetitionService,
    private batchService: BatchAllocationService,
  ) {

  }

  ngOnInit(): void {
    this.getFranchiseList();
    this.getExamCenterList();
    this.getCompetitionList();
    utils.addButtonTitle.set('Student');
  }

  getCompetitionList() {
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList)
          utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }


  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'fullName', header: 'Full Name', width: '20%', styleClass: 'fullName' },
      { field: 'instructorName', header: 'Instructor', width: '20%', styleClass: 'instructorName' },
      { field: 'franchiseName', header: 'Franchise', width: '20%', styleClass: 'franchiseName' },
      { field: 'levelName', header: 'Level', width: '10%', styleClass: 'levelName' },
      { field: 'mobileNo', header: 'Mobile Number', width: '10%', styleClass: 'mobileNo' },
      { field: 'status', header: 'Status', width: '20%', styleClass: 'status' },
      // { field: 'studentLastName', header: 'Last Name', width: '20%', styleClass: 'studentLastName' },
      // { field: 'emailId', header: 'Email', width: '15%', styleClass: 'emailId' },
      // { field: 'dob', header: 'DOB', width: '10%', styleClass: 'dob' },
      // { field: 'schoolName', header: 'School Name', width: '20%', styleClass: 'schoolName' },
      // { field: 'standard', header: 'Standard', width: '20%', styleClass: 'Standard' },
      // { field: 'franchiseTypeName', header: 'Franchise Type', width: '15%', styleClass: 'franchiseTypeName' },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
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
  getExamCenterList() {
    utils.isTableLoading.set(true);
    const apiCall = this.examCenterService.getExamCenterList();
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.examCenterList = response;
          // console.log(this.examCenterList);
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examCenterList);
          this.tableDataSource = response.map((item: any) => {
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
    this.franchiseId = event?.value
    if (this.selectedFranchise !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }

  }
  handleAddEditAction() {

  }
  handleSearchAction() {
    this.getStudentListByFranchise();
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
  getStudentListByFranchise() {
    utils.isTableLoading.set(true);
    this.setTableColumns();
    const apiCall = this.studentService.getStudentListByFranchiseId(this.franchiseId)
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.studentList = response.map((item: any) => {
            item['studentPhoto'] = item['studentPhoto']?.replace('webapi', 'comp');
            item['fullName'] = item['studentFirstName'] + " " + item['studentLastName'];
            return item;
          });
          this.tableDataSource = this.studentList;
          this.showGrid = this.tableDataSource.length > 1 ? true : false;
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
  handleAllocateBatch() {
    this.isAllocateActionLoading = true;
    this.batchService.saveStudentBatchAllocation(this.studentBatchAllocationList).subscribe({
      next: (response) => {
        this.isAllocateActionLoading = false;
        utils.setMessages(response.message, 'success');
      },
      error: (error: HttpErrorResponse) => {
        this.isAllocateActionLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedCompetiton !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
  onSelectedRowsChange(selectedRows: any[]) {
    this.studentBatchAllocationList = {
      studentBatchAllocationId: 0,
      compititionId: this.selectedCompetiton,
      franchiseId: this.franchiseId,
      examCenterId: this.selectedExamCenter,
      batchTimeSlotId: this.selectedBatchTime,
      batchAllocatedDate: new Date().toISOString(),
      franchiseName: "",
      examCenterName: "",
      compititionName: "",
      batchTimeSlotName: "",
      studentBatchAllocationDetails: selectedRows.map((row: any) => ({
        studentBatchAllocationDetailId: 0,
        studentBatchAllocationId: this.selectedBatchTime,
        studentId: row.studentId || 0,
        levelId: row.levelId || 0,
        maxNo: row.maxNo || 0,
        hallTicketNumber: row.hallTicketNumber || '',
        studentFullName: row.fullName || '',
        levelName: row.levelName || ''
      }))
    };
    this.validataAllocateBatch(selectedRows);
    console.log(this.studentBatchAllocationList);
  }
  validataAllocateBatch(selectedRows: any) {
    this.validAllocate = (
      selectedRows.length > 0 && // At least one student is selected
      this.selectedExamCenter !== '' && // Exam center is selected
      this.selectedBatchTime !== '' && // Batch time is selected
      this.selectedCompetiton !== '' && // Competition is selected
      this.franchiseId !== '' // Franchise is selected
    );
  }

}
