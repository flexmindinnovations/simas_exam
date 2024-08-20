import { Component, effect, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Franchise } from '../../interfaces/Fanchise';
import { CommonModule, formatDate } from '@angular/common';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { utils } from '../../utils';
import { ButtonModule } from 'primeng/button';
import { AddEditFranchiseComponent } from '../../modals/add-edit-franchise/add-edit-franchise.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [CommonModule, DataGridComponent, ButtonModule, AddEditFranchiseComponent],
  providers: [DialogService],
  templateUrl: './franchise.component.html',
  styleUrl: './franchise.component.scss'
})
export class FranchiseComponent implements OnInit {

  franshiseList: Array<Franchise> = [];
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
    private franchiseService: FranchiseService,
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
    utils.addButtonTitle.set('Franchise');
    this.setTableColumns();
    this.getFranchiseList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'franchiseId',
        header: 'Id',
        width: '5%',
        styleClass: 'franchiseId'
      },
      {
        field: 'franchiseName',
        header: 'Franchise Name',
        width: '25%',
        styleClass: 'franchiseName'
      },
      {
        field: 'ownerName',
        header: 'Owner Name',
        width: '25%',
        styleClass: 'ownerName'
      },
      {
        field: 'mobileNo',
        header: 'Mobile Number',
        width: '10%',
        styleClass: 'mobileNo'
      },
      {
        field: 'emailId',
        header: 'Email',
        width: '15%',
        styleClass: 'emailId'
      },
      {
        field: 'joiningDate',
        header: 'Joining Date',
        width: '10%',
        styleClass: 'joiningDate'
      },
      {
        field: 'startDate',
        header: 'Start Date',
        width: '10%',
        styleClass: 'startDate'
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  getFranchiseList() {
    utils.isTableLoading.update(val => !val);
    this.franchiseService.getFranchiseByTypeList('1').subscribe({
      next: (response) => {
        if (response) {
          this.franshiseList = response;
          this.createTableDataSource();
          utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  createTableDataSource() {
    this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.franshiseList);
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditFranchiseComponent, {
      data: this.isEditMode ? this.filterFranchiseInfo(data?.franchiseId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Franchise' : 'Add New Franchise',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getFranchiseList();
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

  filterFranchiseInfo(franchiseId: number) {
    const franchiseItem = this.franshiseList.filter((item) => item.franchiseId
      === franchiseId)[0];
    return { ...franchiseItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(rowData: any) {
    const franchiseId = rowData?.franchiseId;
    this.franchiseService.deleteFranchinse(franchiseId).subscribe({
      next: (response) => {
        if (response?.status) {
          utils.setMessages('Record deleted successfully', 'success');
          const rowIndex = this.franshiseList.findIndex((item) => item?.franchiseId === franchiseId);
          if (rowIndex > -1) {
            this.franshiseList.splice(rowIndex, 1);
            this.tableDataSource.splice(rowIndex, 1);
          }
        } else {
          utils.setMessages('Record could not be deleted', 'error');
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages('Error while deleting record', 'error');
      }
    })
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000);
  }
}
