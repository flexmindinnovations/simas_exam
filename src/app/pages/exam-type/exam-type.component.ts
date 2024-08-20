import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditExamComponent } from '../../modals/add-edit-exam/add-edit-exam.component';
import { utils } from '../../utils';
import { Message } from 'primeng/api';
import { ExamService } from '../../services/exam/exam.service';
import { AddEditExamTypeComponent } from '../../modals/add-edit-exam-type/add-edit-exam-type.component';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';

@Component({
  selector: 'app-exam-type',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './exam-type.component.html',
  styleUrl: './exam-type.component.scss'
})
export class ExamTypeComponent {

  colDefs: any[] = [];
  examTypeList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  @ViewChild('examListTable', { static: false }) examListTable!: Table;

  constructor(
    private examTypeService: ExamTypeService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const isDeleteAction = utils.isTableDeleteAction();
      if (isDeleteAction) {
        this.deleteExamTypeRow(utils.tableDeleteRowData());
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
  utils.addButtonTitle.set('Exam Type');
  this.setTableColumns();
  this.getExamList();
}

setTableColumns() {
  this.colDefs = [
    {
      field: 'examTypeId',
      header: 'Id',
      width: '5%',
      styleClass: 'examTypeId'
    },
    {
      field: 'examTypeName',
      header: 'Exam Type Name',
      width: '100%',
      styleClass: 'examName'
    },
    {
      field: 'action',
      header: 'Action',
      width: '10%',
      styleClass: 'action'
    }
  ];
}

getExamList() {
  utils.isTableLoading.update(val => !val);
  this.examTypeService.getExamTypeList().subscribe({
    next: (response) => {
      if (response) {
        this.examTypeList = response;
        this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examTypeList)
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
  this.dialogRef = this.dialogService.open(AddEditExamTypeComponent, {
    data: this.isEditMode ? this.filterExamInfo(data?.examId) : { isEditMode: this.isEditMode },
    closable: false,
    modal: true,
    height: 'auto',
    width: utils.isMobile() ? '95%' : '42%',
    styleClass: 'add-edit-dialog',
    header: this.isEditMode ? 'Edit Exam Type' : 'Add New Exam Type',
  });

  this.dialogRef.onClose.subscribe((res) => {
    if (res) {
      if (res?.status) {
        utils.setMessages(res.message, 'success');
        this.getExamList();
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
filterExamInfo(examTypeId: number) {
  const examTypeItem = this.examTypeList.filter((item) => item.examTypeId
    === examTypeId)[0];
  return { ...examTypeItem, isEditMode: this.isEditMode };
}

filterGlobal(event: Event) {
  const input = event.target as HTMLInputElement;
  this.examListTable.filterGlobal(input.value, 'contains');
}

clear(table: Table) {
  table.clear();
  this.searchValue = ''
}

handleRowDelet(event: any) {
  const deleteItemIndex = this.examTypeList.findIndex((item) => item?.id === event?.id);
  if (deleteItemIndex > -1) {
    this.examTypeList.splice(deleteItemIndex, 1);
    this.tableDataSource.splice(deleteItemIndex, 1);
    const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
    utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
  }
}

deleteExamTypeRow(data: any) {
  setTimeout(() => {
    utils.isTableDeleteAction.set(false);
  }, 2000)
}
}
