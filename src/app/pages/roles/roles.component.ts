import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { utils } from '../../utils';
import { Message } from 'primeng/api';
import { AddEditRoleComponent } from '../../modals/add-edit-role/add-edit-role.component';
import { RoleService } from '../../services/role/role.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  providers: [DialogService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  colDefs: any[] = [];
  roleList: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;

  constructor(
    private roleService: RoleService,
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
    utils.addButtonTitle.set('Role');
    this.setTableColumns();
    this.getRoleList();
  }

  setTableColumns() {
    this.colDefs = [
      {
        field: 'roleId',
        header: 'Id',
        width: '5%',
        styleClass: 'roleId'
      },
      {
        field: 'roleName',
        header: 'Role Name',
        width: '100%',
        styleClass: 'roleName'
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
    utils.isTableLoading.set(true);
    this.roleService.getRoleList().subscribe({
      next: (response) => {
        if (response) {
          this.roleList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.roleList)
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
    this.dialogRef = this.dialogService.open(AddEditRoleComponent, {
      data: this.isEditMode ? this.filterRoleInfo(data?.roleId) : { isEditMode: this.isEditMode, savedItems: this.roleList },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? `Edit Role: ${data?.roleName}` : 'Add New Role',
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
      }
      // utils.isTableEditAction.set(false);
    })
  }

  filterRoleInfo(roleId: number) {
    const roleItem = this.roleList.filter((item) => item.roleId
      === roleId)[0];
    return { ...roleItem, savedItems: this.roleList, isEditMode: this.isEditMode };
  }

  deleteTableRow(data: any) {
    const deleteItemIndex = this.roleList.findIndex((item) => item?.id === data?.roleId);
    if (deleteItemIndex > -1) {
      this.roleList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
  }
}
