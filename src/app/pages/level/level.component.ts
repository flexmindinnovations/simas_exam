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
import { ExamService } from '../../services/exam/exam.service';
import { utils } from '../../utils';
import { AddEditLevelComponent } from '../../modals/add-edit-level/add-edit-level.component';
import { LevelService } from '../../services/level/level.service';

@Component({
  selector: 'app-level',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './level.component.html',
  styleUrl: './level.component.scss'
})
export class LevelComponent {
  colDefs: any[] = [];
  childColDefs: any[] = [];
  levelList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  isTreeList: boolean = true;

  constructor(
    private levelService: LevelService,
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
    utils.addButtonTitle.set('Level');
    this.setTableColumns();
    this.getLevelList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'levelId',
        header: 'Id',
        width: '8%',
        styleClass: 'levelId'
      },
      {
        field: 'levelName',
        header: 'Level Name',
        width: '100%',
        styleClass: 'levelName'
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  getLevelList() {
    utils.isTableLoading.set(true);
    this.levelService.getLevelList().subscribe({
      next: (response) => {
        if (response) {
          this.levelList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.levelList);
          this.tableDataSource = response.map((item: any) => {
            const children = item?.examRoundList.filter((child: any) => child.levelId === item?.levelId);
            item['children'] = children;
            delete item['examRoundList'];
            return item;
          })
          this.setChildColDefs();
          utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  setChildColDefs() {
    this.childColDefs = [
      {
        field: 'roundId',
        header: 'Round Id',
        width: '10%',
        styleClass: 'levelId'
      },
      {
        field: 'roundName',
        header: 'Round Name',
        width: '50%',
        styleClass: 'roundName'
      },
      {
        field: 'numberOfQuestion',
        header: 'Total Questions',
        width: '200%',
        styleClass: 'numberOfQuestion'
      },
      {
        field: 'examRoundTime',
        header: 'Round Time',
        width: '20%',
        styleClass: 'examRoundTime'
      },
    ];
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditLevelComponent, {
      data: this.isEditMode ? this.filterLevelInfo(data?.levelId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Level' : 'Add New Level',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getLevelList();
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

  filterLevelInfo(rowId: number) {
    const filteredItem = this.levelList.filter((item) => item.levelId
      === rowId)[0];
    return { ...filteredItem, isEditMode: this.isEditMode };
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  handleRowDelet(event: any) {
    const deleteItemIndex = this.levelList.findIndex((item) => item?.id === event?.id);
    if (deleteItemIndex > -1) {
      this.levelList.splice(deleteItemIndex, 1);
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

