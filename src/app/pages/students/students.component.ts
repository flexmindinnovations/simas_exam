import { Component, effect, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Student } from '../../interfaces/Student';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StudentService } from '../../services/student/student.service';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditStudentComponent } from '../../modals/add-edit-student/add-edit-student.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, DataGridComponent, ButtonModule, AddEditStudentComponent],
  providers: [DialogService],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {

  studentList: Array<Student> = [];
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
    private studentService: StudentService,
    private dialogService: DialogService
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
    utils.addButtonTitle.set('Student');
    this.setTableColumns();
    this.getStudentList();
  }

  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'studentFirstName', header: 'First Name', width: '20%', styleClass: 'studentFirstName' },
      { field: 'studentLastName', header: 'Last Name', width: '20%', styleClass: 'studentLastName' },
      { field: 'mobileNo', header: 'Mobile Number', width: '10%', styleClass: 'mobileNo' },
      { field: 'emailId', header: 'Email', width: '15%', styleClass: 'emailId' },
      { field: 'dob', header: 'DOB', width: '10%', styleClass: 'dob' },
      { field: 'schoolName', header: 'School Name', width: '20%', styleClass: 'schoolName' },
      // { field: 'standard', header: 'Standard', width: '20%', styleClass: 'Standard' },
      // { field: 'levelName', header: 'Level', width: '10%', styleClass: 'levelName' },
      // { field: 'franchiseTypeName', header: 'Franchise Type', width: '15%', styleClass: 'franchiseTypeName' },
      // { field: 'franchiseName', header: 'Franchise', width: '15%', styleClass: 'franchiseName' },
      // { field: 'instructorName', header: 'Instructor', width: '20%', styleClass: 'instructorName' },
      { field: 'status', header: 'Status', width: '20%', styleClass: 'status' },
      { field: 'action', header: 'Action', width: '10%', styleClass: 'action' },
    ];
  }

  getStudentList() {
    utils.isTableLoading.update(val => !val);
    this.studentService.getStudentList().subscribe({
      next: (response) => {
        if (response) {
          this.studentList = response.map((item: any) => {
            item['studentPhoto'] = item['studentPhoto']?.replace('webapi', 'comp');
            return item;
          });
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.studentList);
          utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.isTableLoading.update(val => !val);
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
      width: utils.isMobile() ? '95%' : '42%',
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
