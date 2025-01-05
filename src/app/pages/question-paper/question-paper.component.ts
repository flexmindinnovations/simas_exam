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
import { QuestionPaperService } from '../../services/question-paper/question-paper.service';
import { AddEditQuestionPaperComponent } from '../../modals/add-edit-question-paper/add-edit-question-paper.component';

@Component({
  selector: 'app-question-paper',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './question-paper.component.html',
  styleUrl: './question-paper.component.scss'
})
export class QuestionPaperComponent {
  colDefs: any[] = [];
  questionPaperList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  childColDefs: any[] = [];
  isTreeList: boolean = true;

  constructor(
    private questionPaperService: QuestionPaperService,
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
    utils.addButtonTitle.set('Question Paper');
    this.setTableColumns();
    this.getQuestionPaperList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'questionPaperId',
        header: 'Id',
        width: '5%',
        styleClass: 'questionPaperId'
      },
      {
        field: 'examTypeName',
        header: 'Question Paper Name',
        width: '30%',
        styleClass: 'questionPaperName'
      },
      {
        field: 'levelName',
        header: 'Level Name',
        width: '30%',
        styleClass: 'levelName'
      },
      {
        field: 'roundName',
        header: 'Round Name',
        width: '30%',
        styleClass: 'roundName'
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
        field: 'questionType',
        header: 'Question Type',
        width: '20%',
        styleClass: 'questionType'
      },
      {
        field: 'noOfQuestion',
        header: 'Total Questions',
        width: '20%',
        styleClass: 'noOfQuestion'
      },
      {
        field: 'markPerQuestion',
        header: 'Mark per Question',
        width: '20%',
        styleClass: 'markPerQuestion'
      },
      {
        field: 'rows',
        header: 'Rows',
        width: '20%',
        styleClass: 'rows'
      },
      {
        field: 'columns',
        header: 'Columns',
        width: '20%',
        styleClass: 'columns'
      },
    ];
  }


  getQuestionPaperList() {
    utils.isTableLoading.set(true);
    this.questionPaperService.getQuestionPaperList().subscribe({
      next: (response) => {
        if (response) {
          this.questionPaperList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.questionPaperList);
          this.tableDataSource = response.map((item: any) => {
            const children = item?.questionPaperDetailsModels.filter((child: any) => child.questionPaperId === item?.questionPaperId);
            item['children'] = children;
            delete item['questionPaperDetailsModels'];
            return item;
          })
          utils.isTableLoading.update(val => !val);
          // utils.setMessages(response.message, 'success');
          this.setChildColDefs();
        }
      },
      error: (error: HttpErrorResponse) => {
      // utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleAddEditAction(data?: any) {
    this.dialogRef = this.dialogService.open(AddEditQuestionPaperComponent, {
      data: this.isEditMode ? this.filterTableData(data?.questionPaperId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '60%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Question Paper' : 'Add New Question Paper',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getQuestionPaperList();
        } else {
          utils.setMessages(res.message, 'error');
        }
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
      } else {
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
      }
    })
  }
  filterTableData(questionPaperId: number) {
    const questionPaperItem = this.questionPaperList.filter((item) => item.questionPaperId
      === questionPaperId)[0];
    return { ...questionPaperItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(event: any) {
    const deleteItemIndex = this.questionPaperList.findIndex((item) => item?.id === event?.id);
    if (deleteItemIndex > -1) {
      this.questionPaperList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
      setTimeout(() => {
        utils.isTableDeleteAction.set(false);
      }, 2000);
    }
  }
}

