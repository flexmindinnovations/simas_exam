import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { AddEditExamComponent } from '../../modals/add-edit-exam/add-edit-exam.component';
import { ExamService } from '../../services/exam/exam.service';
import { utils } from '../../utils';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { AddEditQuestionBankComponent } from '../../modals/add-edit-question-bank/add-edit-question-bank.component';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.scss'
})
export class QuestionBankComponent {
  colDefs: any[] = [];
  questionBankList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  constructor(
    private examService: ExamService,
    private questionBankService: QuestionBankService,
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
    utils.addButtonTitle.set('Question Bank');
    this.setTableColumns();
    this.getDataSourceList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'questionBankId',
        header: 'Id',
        width: '5%',
        styleClass: 'questionBankId'
      },
      {
        field: 'levelName',
        header: 'Level Name',
        width: '25%',
        styleClass: 'levelName'
      },
      {
        field: 'roundName',
        header: 'Round Name',
        width: '25%',
        styleClass: 'roundName'
      },
      {
        field: 'formula',
        header: 'Formula',
        width: '25%',
        styleClass: 'formula'
      },
      {
        field: 'date',
        header: 'Date',
        width: '25%',
        styleClass: 'date'
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  getDataSourceList() {
    utils.isTableLoading.set(true);
    this.questionBankService.getQuestionBankList().subscribe({
      next: (response) => {
        if (response) {
          this.questionBankList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.questionBankList)
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
    this.dialogRef = this.dialogService.open(AddEditQuestionBankComponent, {
      data: this.isEditMode ? this.filterTableInfo(data?.examId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Question Bank' : 'Add New Question Bank',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getDataSourceList();
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
  filterTableInfo(rowId: number) {
    const filteredItem = this.questionBankList.filter((item) => item.questionBankId
      === rowId)[0];
    return { ...filteredItem, isEditMode: this.isEditMode };
  }

  handleRowDelet(event: any) {
    const deleteItemIndex = this.questionBankList.findIndex((item) => item?.id === event?.id);
    if (deleteItemIndex > -1) {
      this.questionBankList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }

  deleteTableRow(data: any) {
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
  }
}

