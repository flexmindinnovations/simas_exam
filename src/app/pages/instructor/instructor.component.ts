import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { Instructor } from '../../interfaces/Instructor';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditInstructorComponent } from '../../modals/add-edit-instructor/add-edit-instructor.component';
import { InstructorService } from '../../services/instructor/instructor.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, DataGridComponent, ButtonModule],
  providers: [DialogService],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss'
})
export class InstructorComponent implements OnInit {
  instructorList: Array<Instructor> = [];
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
    private instructorService: InstructorService,
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
    utils.addButtonTitle.set('Instructor');
    this.setTableColumns();
    this.getInstructorList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'instructorId',
        header: 'Id',
        width: '5%',
        styleClass: 'instructorId'
      },
      {
        field: 'instructorName',
        header: 'Instructor Name',
        width: '20%',
        styleClass: 'instructorName'
      },
      {
        field: 'franchiseName',
        header: 'Franchise Name',
        width: '20%',
        styleClass: 'franchiseName'
      },
      {
        field: 'mobileNo',
        header: 'Mobile Number',
        width: '10%',
        styleClass: 'mobileNo'
      },
      {
        field: 'emailId',
        header: 'Email',
        width: '15%',
        styleClass: 'emailId'
      },
      {
        field: 'franchiseTypeName',
        header: 'Franchise Type',
        width: '10%',
        styleClass: 'franchiseTypeName'
      },
      {
        field: 'startDate',
        header: 'Start Date',
        width: '10%',
        styleClass: 'startDate'
      },
      {
        field: 'endDate',
        header: 'End Date',
        width: '10%',
        styleClass: 'endDate'
      },
      {
        field: 'status',
        header: 'Status',
        width: '10%',
        styleClass: 'status'
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  getInstructorList() {
    utils.isTableLoading.update(val => !val);
    this.instructorService.getInstructorList().subscribe({
      next: (response) => {
        if (response) {
          this.instructorList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.instructorList);
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
    this.dialogRef = this.dialogService.open(AddEditInstructorComponent, {
      data: this.isEditMode ? this.filterInstructorInfo(data?.franchiseId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '40%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Instructor details' : 'Add New Instructor',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getInstructorList();
          utils.isTableEditAction.set(false);
        } else {
          utils.isTableEditAction.set(false);
          utils.setMessages(res.message, 'error');
        }
      } else {
        utils.isTableEditAction.set(false);
      }
    })
  }

  filterInstructorInfo(instructorId: number) {
    const instructorIdItem = this.instructorList.filter((item) => item.instructorId
      === instructorId)[0];
    return { ...instructorIdItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(rowData: any) {
    const instructorId = rowData?.instructorId;
    this.instructorService.deleteInstructor(instructorId).subscribe({
      next: (response) => {
        if (response?.status) {
          utils.setMessages('Record deleted successfully', 'success');
          const rowIndex = this.instructorList.findIndex((item) => item?.instructorId === instructorId);
          if (rowIndex > -1) {
            this.instructorList.splice(rowIndex, 1);
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
