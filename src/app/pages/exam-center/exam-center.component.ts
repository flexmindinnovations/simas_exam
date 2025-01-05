import { CommonModule } from '@angular/common';
import { Component, effect, type AfterViewInit, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, type DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { Message } from 'primeng/api';
import { AddEditExamCenterComponent } from '../../modals/add-edit-exam-center/add-edit-exam-center.component';

@Component({
  selector: 'app-exam-center',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './exam-center.component.html',
  styleUrl: './exam-center.component.scss'
})
export class ExamCenterComponent implements OnInit, AfterViewInit {
  colDefs: any[] = [];
  childColDefs: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  isTreeList: boolean = true;
  examCenterList: any[] = [];
  constructor(
    private examCenterService: ExamCenterService,
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
    utils.addButtonTitle.set('Exam Center');
    utils.setPageTitle('Exam Center');
    this.setTableColumns();
  }

  ngAfterViewInit(): void {
    this.getExamCenterList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'examCenterId',
        header: 'Id',
        width: '8%',
        styleClass: 'examCenterId'
      },
      {
        field: 'examCenterName',
        header: 'Center Name',
        width: '100%',
        styleClass: 'examCenterName'
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  setChildColDefs() {
    this.childColDefs = [
      {
        field: 'batchTimeSlotId',
        header: 'Batch Id',
        width: '10%',
        styleClass: 'batchTimeSlotId'
      },
      {
        field: 'batchTimeSlotName',
        header: 'Batch',
        width: '50%',
        styleClass: 'batchTimeSlotName'
      }
    ];
  }

  getExamCenterList() {
    utils.isTableLoading.set(true);
    const apiCall = this.examCenterService.getExamCenterList();
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.examCenterList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examCenterList);
          this.tableDataSource = response.map((item: any) => {
            const children = item?.batchTimeSlotList.filter((child: any) => child.examCenterId === item?.examCenterId);
            item['children'] = children;
            delete item['batchTimeSlotList'];
            return item;
          })
          this.setChildColDefs();
        // utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          utils.setMessages(error.message, 'error');
        // utils.isTableLoading.update(val => !val);
        }
      }
    })
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditExamCenterComponent, {
      data: this.isEditMode ? this.filterExamCenterInfo(data?.examCenterId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Exam Center' : 'Add New Exam Center',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getExamCenterList();
          utils.isTableEditAction.set(false);
        } else {
          utils.isTableEditAction.set(false);
          utils.setMessages(res.message, 'error');
        }
      } else {
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
      }
    })

  }

  filterExamCenterInfo(examCenterId: any) {
    const filteredItem = this.examCenterList.filter((item) => item.examCenterId
      === examCenterId)[0];
    return { ...filteredItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(rowData: any) {
    const apiCall = this.examCenterService.deleteExamCenter(rowData?.examCenterId);
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.removeRowFromLocal(rowData);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          utils.setMessages(error.message, 'error');
          utils.isTableLoading.set(false);
        }
      }
    })
  }

  removeRowFromLocal(rowData: any) {
    const deleteItemIndex = this.examCenterList.findIndex((item) => item?.examCenterId === rowData?.examCenterId);
    if (deleteItemIndex > -1) {
      this.examCenterList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }
}
