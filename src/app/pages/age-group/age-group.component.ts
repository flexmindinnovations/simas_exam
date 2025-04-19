import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { utils } from '../../utils';
import { HttpErrorResponse } from '@angular/common/http';
import { AgeGroupService } from '../../services/age-group/age-group.service';
import { AddEditAgeGroupComponent } from '../../modals/add-edit-age-group/add-edit-age-group.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-age-group',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DataGridComponent,
    AddEditAgeGroupComponent
  ],
  providers: [DialogService, AgeGroupService],
  templateUrl: './age-group.component.html',
  styleUrl: './age-group.component.scss'
})
export class AgeGroupComponent implements OnInit {
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  ageGroupList: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
    private ageGroupService: AgeGroupService,
    private dialogService: DialogService,
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
    utils.addButtonTitle.set('Age');
    this.getAgeGroupList();
    this.setTableColumns();

  }

  getAgeGroupList() {
    utils.isTableLoading.set(true);
    this.ageGroupService.getAgeGroupList().subscribe({
      next: (response: any) => {
        if (response) {
          this.ageGroupList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.ageGroupList);
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditAgeGroupComponent, {
      data: this.isEditMode ? this.filterAgeGroupInfo(data?.ageGroupId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : utils.desktopModalWidth,
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Age Group' : 'Add New Age Group',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getAgeGroupList();
        } else {
          utils.setMessages(res.message, 'error');
        }
      } else {
        utils.isTableEditAction.set(false);
        utils.isAddActionLoading.set(false);
      }
    })
  }

  filterAgeGroupInfo(ageGroupId: number) {
    const ageGroupItem = this.ageGroupList.filter((item) => item.ageGroupId
      === ageGroupId)[0];
    return { ...ageGroupItem, isEditMode: this.isEditMode };
  }


  setTableColumns() {
    this.colDefs = [
      { field: 'ageGroupId', header: 'Id', width: '5%', styleClass: 'ageGroupId' },
      { field: 'ageGroupName', header: 'Age Group', width: '15%', styleClass: 'ageGroupName' },
      { field: 'compititionName', header: 'compitition', width: '25%', styleClass: 'compititionName' },
      { field: 'startDate', header: 'Start Date', width: '25%', styleClass: 'startDate' },
      { field: 'endDate', header: 'End Date', width: '25%', styleClass: 'endtDate' },
      {
        field: 'action',
        header: 'Action',
        width: '5%',
        styleClass: 'action'
      }
    ];
  }

  deleteTableRow(data: any) {
    const deleteItemIndex = this.ageGroupList.findIndex((item) => item?.id === data?.ageGroupId);
    if (deleteItemIndex > -1) {
      this.ageGroupList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
  }
}
