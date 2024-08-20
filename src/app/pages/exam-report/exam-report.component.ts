import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { AddEditExamComponent } from '../../modals/add-edit-exam/add-edit-exam.component';
import { ExamService } from '../../services/exam/exam.service';
import { utils } from '../../utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';

@Component({
  selector: 'app-exam-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './exam-report.component.html',
  styleUrl: './exam-report.component.scss'
})
export class ExamReportComponent {
  colDefs: any[] = [];
  examList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  @ViewChild('examListTable', { static: false }) examListTable!: Table;

  constructor(
    private examService: ExamService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const isDeleteAction = utils.isTableDeleteAction();
      if (isDeleteAction) {
        this.deleteExamRow(utils.tableDeleteRowData());
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
    utils.addButtonTitle.set('Exam Report');
    this.setTableColumns();
    this.getExamList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'examRoportId',
        header: 'Id',
        width: '5%',
        styleClass: 'examReportId'
      },
      {
        field: 'examReportName',
        header: 'Exam Report Name',
        width: '100%',
        styleClass: 'examReportName'
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
    this.examService.getExamList().subscribe({
      next: (response) => {
        if (response) {
          this.examList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examList)
          utils.isTableLoading.update(val => !val);
          utils.setMessages(response.message, 'success');
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
    this.dialogRef = this.dialogService.open(AddEditExamComponent, {
      data: this.isEditMode ? this.filterExamInfo(data?.examId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Exam Report' : 'Add New Exam Report',
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

  filterExamInfo(examId: number) {
    const franchiseItem = this.examList.filter((item) => item.examId
      === examId)[0];
    return { ...franchiseItem, isEditMode: this.isEditMode };
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
    const deleteItemIndex = this.examList.findIndex((item) => item?.id === event?.id);
    if (deleteItemIndex > -1) {
      this.examList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }

  deleteExamRow(data: any) {
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
}
}
