import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { utils } from '../../utils';
import { FormsModule } from '@angular/forms';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { Message } from 'primeng/api';
import { ExamService } from '../../services/exam/exam.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditExamComponent } from '../../modals/add-edit-exam/add-edit-exam.component';
@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent implements OnInit {

  colDefs: any[] = [];
  examList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

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
    utils.addButtonTitle.set('Exam');
    this.setTableColumns();
    this.getExamList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'examId',
        header: 'Id',
        width: '5%',
        styleClass: 'examId'
      },
      {
        field: 'examName',
        header: 'Exam Name',
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
      header: this.isEditMode ? 'Edit Exam' : 'Add New Exam',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getExamList();
        } else {
          utils.setMessages(res.message, 'error');
        }
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
      } else {
        utils.isTableEditAction.set(false);
        utils.isAddActionLoading.set(false);
      }
    })
  }

  filterExamInfo(examId: number) {
    const franchiseItem = this.examList.filter((item) => item.examId
      === examId)[0];
    return { ...franchiseItem, isEditMode: this.isEditMode };
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
