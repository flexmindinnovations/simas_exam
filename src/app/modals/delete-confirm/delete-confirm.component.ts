import { CommonModule } from '@angular/common';
import { Component, effect, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableDeleteAction, utils } from '../../utils';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.scss'
})
export class DeleteConfirmComponent implements OnInit {
  isDeleteActionLoading: boolean = false;
  data: any;
  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    effect(() => {
      this.isDeleteActionLoading = utils.isTableDeleteAction();
    })
  }

  ngOnInit(): void {
    this.data = this.config.data;
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }

  handleDeleteAction() {
    this.isDeleteActionLoading = true;
    utils.isTableDeleteAction.set(this.isDeleteActionLoading);
    utils.tableDeleteRowData.set(this.data);
    if (!this.isDeleteActionLoading) {
      this.dialogRef.close(this.data);
    }
  }
}
