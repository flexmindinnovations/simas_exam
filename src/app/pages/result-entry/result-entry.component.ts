import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { utils } from '../../utils';

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DataGridComponent,
  ],
  providers: [DialogService],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent {
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
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
    utils.addButtonTitle.set('Result Entry');
    this.getResultEntryList();
    this.setTableColumns();

  }

  getResultEntryList() {

  }

  handleAddEditAction(data?: any) {
    // if (this.isEditMode) utils.isTableEditAction.set(true);
    // else utils.isAddActionLoading.set(true);
    // this.dialogRef = this.dialogService.open(AddEditAgeGroupComponent, {
    //   data: this.isEditMode ? this.filterAgeGroupInfo(data?.ageGroupId) : { isEditMode: this.isEditMode },
    //   closable: false,
    //   modal: true,
    //   height: 'auto',
    //   width: utils.isMobile() ? '95%' : utils.desktopModalWidth,
    //   styleClass: 'add-edit-dialog',
    //   header: this.isEditMode ? 'Edit Age Group' : 'Add New Age Group',
    // });

    // this.dialogRef.onClose.subscribe((res) => {
    //   if (res) {
    //     if (res?.status) {
    //       utils.setMessages(res.message, 'success');
    //       this.getAgeGroupList();
    //       utils.isAddActionLoading.set(false);
    //     } else {
    //       utils.setMessages(res.message, 'error');
    //       utils.isAddActionLoading.set(false);
    //     }
    //   } else {
    //     utils.isTableEditAction.set(false);
    //     utils.isAddActionLoading.set(false);
    //   }
    // })
  }

  // filterAgeGroupInfo(ageGroupId: number) {
  //   const ageGroupItem = this.ageGroupList.filter((item) => item.ageGroupId
  //     === ageGroupId)[0];
  //   return { ...ageGroupItem, isEditMode: this.isEditMode };
  // }


  setTableColumns() {
    this.colDefs = [
      { field: 'resultEntryId', header: 'Id', width: '5%', styleClass: 'resultEntryId' },
      { field: 'hallTicketNo', header: 'hallTicketNo', width: '10%', styleClass: 'hallTicketNo' },
      { field: 'resultEntryName', header: 'Result Entry', width: '15%', styleClass: 'resultEntryName' },

      {
        field: 'action',
        header: 'Action',
        width: '5%',
        styleClass: 'action'
      }
    ];
  }

  deleteTableRow(data: any) {
    // const deleteItemIndex = this.ageGroupList.findIndex((item) => item?.id === data?.ageGroupId);
    // if (deleteItemIndex > -1) {
    //   this.ageGroupList.splice(deleteItemIndex, 1);
    //   this.tableDataSource.splice(deleteItemIndex, 1);
    //   const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
    //   utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    // }
    // setTimeout(() => {
    //   utils.isTableDeleteAction.set(false);
    // }, 2000)
  }
}
