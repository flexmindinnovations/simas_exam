import { Component, OnInit, effect } from '@angular/core';
import { CompetitionService } from '../../services/competition/competition.service';
import { utils } from '../../utils';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { AddEditRoleComponent } from '../../modals/add-edit-role/add-edit-role.component';
import { AddEditCompetitionComponent } from '../../modals/add-edit-competition/add-edit-competition.component';

@Component({
  selector: 'app-competition',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.scss'
})
export class CompetitionComponent implements OnInit {

  colDefs: any[] = [];
  compeitionList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;


  constructor(
    private competitionService: CompetitionService,
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
    utils.addButtonTitle.set('Competition');
    this.setTableColumns();
    this.getRoleList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'compititionId',
        header: 'Id',
        width: '5%',
        styleClass: 'compititionId'
      },
      {
        field: 'compititionName',
        header: 'Competition Name',
        width: '100%',
        styleClass: 'compititionName'
      },
      {
        field: 'compititionDate',
        header: 'Competition Date',
        width: '100%',
        styleClass: 'compititionDate'
      },
      {
        field: 'status',
        header: 'Status',
        width: '100%',
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

  getRoleList() {
    utils.isTableLoading.update(val => !val);
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.compeitionList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.compeitionList)
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
    this.dialogRef = this.dialogService.open(AddEditCompetitionComponent, {
      data: this.isEditMode ? this.filterRoleInfo(data?.competitionId) : { isEditMode: this.isEditMode, savedItems: this.compeitionList },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? `Edit Competition: ${data?.compititionName}` : 'Add New Competition',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getRoleList();
        } else {
          utils.setMessages(res.message, 'error');
        }
      } else {
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
      }
      // utils.isTableEditAction.set(false);
    })
  }

  filterRoleInfo(competitionId: number) {
    const competitionItem = this.compeitionList.filter((item) => item.competitionId
      === competitionId)[0];
    return { ...competitionItem, savedItems: this.compeitionList, isEditMode: this.isEditMode };
  }

  deleteTableRow(data: any) {
    const deleteItemIndex = this.compeitionList.findIndex((item) => item?.id === data?.competitionId);
    if (deleteItemIndex > -1) {
      this.compeitionList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
  }

}
