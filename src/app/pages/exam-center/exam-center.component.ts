import { CommonModule } from '@angular/common';
import { Component, effect, type AfterViewInit, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, type DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { Message } from 'primeng/api';
import { AddEditExamCenterComponent } from '../../modals/add-edit-exam-center/add-edit-exam-center.component';
import { CompetitionService } from '../../services/competition/competition.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-exam-center',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
  providers: [DialogService],
  templateUrl: './exam-center.component.html',
  styleUrl: './exam-center.component.scss'
})
export class ExamCenterComponent implements OnInit, AfterViewInit {
  colDefs: any[] = [];
  childColDefs: any[] = [];
  tableDataSource: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  editModeData: any;
  searchValue: string = '';
  isTreeList: boolean = true;
  examCenterList: any[] = [];
  isPanelCollapsed: boolean = false;
  formGroup!: FormGroup;
  showGrid: boolean = false;
  competitionList: any[] = [];
  isCompetitionListLoading: boolean = false;
  selectedCompetiton: string = '';
  isSearchDisabled: boolean = true;
  isSearchActionLoading: boolean = false;
  constructor(
    private examCenterService: ExamCenterService,
    private dialogService: DialogService,
    private competitionService: CompetitionService,
    private fb: FormBuilder,
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
    this.initFormGroup();
    utils.addButtonTitle.set('Exam Center');
    utils.setPageTitle('Exam Center');
    // this.setTableColumns();
  }

  ngAfterViewInit(): void {
    this.getCompetitionList();
  }


  getCompetitionList() {
    this.competitionService.getAllCompititionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList)
          // utils.isTableLoading.update(val => !val);
        }
      },
      error: (error: HttpErrorResponse) => {
        // utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    this.showGrid = false;
    if (this.selectedCompetiton !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }

  handleSearchAction() {
    this.setTableColumns();
    utils.isTableLoading.set(true);
    this.showGrid = true;
    this.isSearchActionLoading = true;
    if (this.formGroup.valid) {
      this.getExamCenterList();
    }
  }


  setTableColumns() {
    this.colDefs = [
      {
        field: 'examCenterId',
        header: 'Id',
        width: '8%',
        styleClass: 'examCenterId'
      },
      {
        field: 'examCenterName',
        header: 'Center Name',
        width: '100%',
        styleClass: 'examCenterName'
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
        field: 'batchTimeSlotId',
        header: 'Batch Id',
        width: '10%',
        styleClass: 'batchTimeSlotId'
      },
      {
        field: 'batchTimeSlotName',
        header: 'Batch',
        width: '50%',
        styleClass: 'batchTimeSlotName'
      }
    ];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      compititionId: ['', [Validators.required]],
    })
  }

  getExamCenterList() {
    utils.isTableLoading.set(true);
    const formVal = this.formGroup.getRawValue();
    const apiCall = this.examCenterService.getExamCenterListByCompititionIdWise(formVal.compititionId);
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.examCenterList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examCenterList);
          this.tableDataSource = response.map((item: any) => {
            const children = item?.batchTimeSlotList.filter((child: any) => child.examCenterId === item?.examCenterId);
            item['children'] = children;
            delete item['batchTimeSlotList'];
            return item;
          })
          this.setChildColDefs();
          // utils.isTableLoading.update(val => !val);
          this.isSearchActionLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          utils.setMessages(error.message, 'error');
          // utils.isTableLoading.update(val => !val);
        }
      }
    })
  }

  handleAddEditAction(data?: any) {
    if (this.isEditMode) utils.isTableEditAction.set(true);
    else utils.isAddActionLoading.set(true);
    this.dialogRef = this.dialogService.open(AddEditExamCenterComponent, {
      data: this.isEditMode ? this.filterExamCenterInfo(data?.examCenterId) : { isEditMode: this.isEditMode },
      closable: false,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: this.isEditMode ? 'Edit Exam Center' : 'Add New Exam Center',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        if (res?.status) {
          utils.setMessages(res.message, 'success');
          this.getExamCenterList();
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

  filterExamCenterInfo(examCenterId: any) {
    const filteredItem = this.examCenterList.filter((item) => item.examCenterId
      === examCenterId)[0];
    return { ...filteredItem, isEditMode: this.isEditMode };
  }

  deleteTableRow(rowData: any) {
    const apiCall = this.examCenterService.deleteExamCenter(rowData?.examCenterId);
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.removeRowFromLocal(rowData);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error) {
          utils.setMessages(error.message, 'error');
          utils.isTableLoading.set(false);
        }
      }
    })
  }

  removeRowFromLocal(rowData: any) {
    const deleteItemIndex = this.examCenterList.findIndex((item) => item?.examCenterId === rowData?.examCenterId);
    if (deleteItemIndex > -1) {
      this.examCenterList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }
}
