import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { AddEditStudentComponent } from '../../modals/add-edit-student/add-edit-student.component';
import { StudentService } from '../../services/student/student.service';
import { Student } from '../../interfaces/Student';
import { utils } from '../../utils';
import { CompetitionService } from '../../services/competition/competition.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LevelService } from '../../services/level/level.service';

@Component({
  selector: 'app-new-result',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule, ButtonModule, AddEditStudentComponent],
  providers: [DialogService, StudentService],
  templateUrl: './new-result.component.html',
  styleUrl: './new-result.component.scss'
})
export class NewResultComponent implements OnInit {
  studentList: Array<Student> = [];
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  competitionList: any[] = [];
  levelNameList: Array<any> = [];
  isCompetitionListLoading: boolean = false;
  selectedCompetiton: string = '';
  isPanelCollapsed: boolean = false;
  formGroup!: FormGroup;
  showGrid: boolean = false;
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  levelListLoading: boolean = false;
  selectedLevel: any = undefined;
  levelList: any[] = [];

  constructor(
    private studentService: StudentService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private levelService: LevelService,
  ) {
    effect(() => {
      const isDeleteAction = utils.isTableDeleteAction();
      if (isDeleteAction) {
        this.deleteTableRow(utils.tableDeleteRowData());
      }
    })

    effect(() => {
      this.isEditMode = utils.isTableEditAction();
      if (this.isEditMode) {
        this.editModeData = utils.tableEditRowData();
        this.handleAddEditAction(this.editModeData);
      }
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {
    this.initFormGroup();
    utils.addButtonTitle.set('Student');
    this.getCompetitionList();
    this.getLevelList();
    this.setTableColumns();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      compititionId: ['', [Validators.required]],
      levelId: ['', [Validators.required]],
    })
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    this.showGrid = false;
    if (this.selectedCompetiton !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }

  handleOnLevelChange(event: DropdownChangeEvent) {
    this.selectedLevel = event.value;
    this.isSearchDisabled = this.selectedLevel === '';
  }

  handleSearchAction() {
    this.setTableColumns();
    utils.isTableLoading.set(true);
    this.isSearchActionLoading = true;
    if (this.formGroup.valid) {
      this.getStudentList();
      this.showGrid = true;
    }
  }



  getCompetitionList() {
    this.competitionService.getAllCompititionList().subscribe({
      next: (response: any) => {
        if (response) {
          const roleName = sessionStorage.getItem('role') || '';
          const secretKey = sessionStorage.getItem('token') || '';
          const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
          this.competitionList = role === 'franchisee' ? response.filter((res: any) => res.isActive === true) : response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList)
          // utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        // utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'studentFirstName', header: 'First Name', width: '20%', styleClass: 'studentFirstName' },
      { field: 'studentLastName', header: 'Last Name', width: '20%', styleClass: 'studentLastName' },
      { field: 'mobileNo', header: 'Mobile Number', width: '10%', styleClass: 'mobileNo' },
      { field: 'levelName', header: 'Level', width: '15%', styleClass: 'levelName' },
      { field: 'dob', header: 'DOB', width: '10%', styleClass: 'dob' },
      { field: 'franchiseName', header: 'Franchise', width: '30%', styleClass: 'franchiseName' },
      { field: 'stuPass', header: 'Student Password', width: '10%', styleClass: 'stuPass' },
      // { field: 'levelName', header: 'Level', width: '10%', styleClass: 'levelName' },
      // { field: 'franchiseTypeName', header: 'Franchise Type', width: '15%', styleClass: 'franchiseTypeName' },
      // { field: 'franchiseName', header: 'Franchise', width: '15%', styleClass: 'franchiseName' },
      // { field: 'instructorName', header: 'Instructor', width: '20%', styleClass: 'instructorName' },
      { field: 'status', header: 'Status', width: '20%', styleClass: 'status' },
    ];
  }

  getStudentList() {
    utils.isTableLoading.set(true);
    const roleName = sessionStorage.getItem('role') || '';
    const secretKey = sessionStorage.getItem('token') || '';
    if (roleName) {
      const instructorId = sessionStorage.getItem('instructorId');
      const franchiseId = sessionStorage.getItem('franchiseId');
      const formVal = this.formGroup.getRawValue();
      const compititionId = formVal['compititionId'];
      const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
      let endpoint = role === 'instructor' ? this.studentService.getStudentListInstructorWise(compititionId, instructorId) : this.studentService.getStudentListCompititionWise(compititionId, franchiseId === null ? 0 : franchiseId);
      endpoint.subscribe({
        next: (response) => {
          if (response) {
            this.studentList = response.map((item: any) => {
              item['studentPhoto'] = item['studentPhoto']?.replace('webapi', 'comp');
              item['stuPass'] = item['status'] === 'Active' ? item['stuPass'] : ''
              return item;
            });
            this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.studentList);
            // this.showGrid = this.tableDataSource.length > 0 ? true : false; // as per required by client
            this.showGrid = true;
            // utils.isTableLoading.update(val => !val);
            this.isSearchActionLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          // utils.isTableLoading.update(val => !val);
          this.isSearchActionLoading = false;
          utils.setMessages(error.message, 'error');
        }
      })
    }
  }

  getLevelList() {
    utils.isTableLoading.set(true);
    this.levelService.getLevelList().subscribe({
      next: (response) => {
        if (response) {
          const roleName = sessionStorage.getItem('role') || '';
          const secretKey = sessionStorage.getItem('token') || '';
          const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
          this.levelList = role === 'franchisee' ? response.filter((res: any) => res.isActive === true) : response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.levelList)
          // utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        // utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditStudentComponent, {
      data: this.isEditMode ? this.filterStudentInfo(data?.studentId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : utils.desktopModalWidth,
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Student' : 'Add New Student',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getStudentList();
        } else {
          utils.setMessages(res.message, 'error');
        }
      } else {
        utils.isTableEditAction.set(false);
        utils.isAddActionLoading.set(false);
      }
    })
  }

  filterStudentInfo(studentId: number) {
    const studentItem = this.studentList.filter((item) => item.studentId
      === studentId)[0];
    return { ...studentItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(rowData: any) {
    const studentId = rowData?.studentId;
    this.studentService.deleteStudent(studentId).subscribe({
      next: (response) => {
        if (response?.status) {
          utils.setMessages('Record deleted successfully', 'success');
          const rowIndex = this.studentList.findIndex((item) => item?.studentId === studentId);
          if (rowIndex > -1) {
            this.studentList.splice(rowIndex, 1);
            this.tableDataSource.splice(rowIndex, 1);
          }
        } else {
          utils.setMessages('Record could not be deleted', 'error');
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages('Error while deleting record', 'error');
      }
    })
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000);
  }
}
