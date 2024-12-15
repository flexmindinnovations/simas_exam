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
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { StudentService } from '../../services/student/student.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { AddEditActivationComponent } from '../../modals/add-edit-activation/add-edit-activation.component';
import { ActivationService } from '../../services/activation/activation.service';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    DataGridComponent,
  ],
  providers: [DialogService],
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss',
})
export class ActivationComponent {
  colDefs: any[] = [];
  activationList: any[] = [];
  tableDataSource: any[] = [];
  activationType = ActivationType;
  activationTypeList: any[] = [];
  franchiseList: any[] = [];
  dialogRef: DynamicDialogRef | undefined;
  isEditMode: boolean = false;
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  isFranchiseListLoading: boolean = false;
  editModeData: any;
  selectedActivationType: string = '';
  selectedFranchise: string = '';
  apiResponse: any;
  validActivate: boolean = false;
  data: string = '';
  isActivateActionLoading: boolean = false;
  showGrid: boolean = false;
  selectedRows: any[] = [];

  constructor(
    private examService: ExamService,
    private franchiseService: FranchiseService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private dialogService: DialogService,
    private activationService: ActivationService
  ) {
    effect(() => {
      const isDeleteAction = utils.isTableDeleteAction();
      if (isDeleteAction) {
        this.deleteExamRow(utils.tableDeleteRowData());
      }
    });

    effect(
      () => {
        this.isEditMode = utils.isTableEditAction();
        if (this.isEditMode) {
          this.editModeData = utils.tableEditRowData();
          this.handleAddEditAction(this.editModeData);
        }
      },
      { allowSignalWrites: true }
    );
  }
  ngOnInit(): void {
    utils.addButtonTitle.set('Activation');
    this.setActivationTypeList();
    this.getFranchiseList();
  }

  getFranchiseList() {
    this.isFranchiseListLoading = true;
    this.franchiseService.getFranchiseByTypeList('1').subscribe({
      next: (response) => {
        if (response) {
          this.franchiseList = response;
          this.isFranchiseListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isFranchiseListLoading = false;
        utils.setMessages(error.message, 'error');
      },
    });
  }

  setActivationTypeList() {
    this.activationTypeList = [
      { id: 1, title: 'Franchise', value: 'franchise' },
      { id: 2, title: 'Student', value: 'student' },
      { id: 3, title: 'Instructor', value: 'instructor' },
    ];
  }

  handleOnActivationTypeChange(event: DropdownChangeEvent) {
    this.selectedFranchise = '';
    this.colDefs = [];
    this.showGrid = false;
    this.tableDataSource = [];
    if (this.selectedActivationType === this.activationType.Franchise)
      this.isSearchDisabled = false;
    else this.isSearchDisabled = true;
  }

  handleOnFranchiseChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    this.showGrid = false;
    if (
      this.selectedActivationType !== this.activationType.Franchise &&
      this.selectedFranchise !== ''
    ) {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }

  handleSearchAction() {
    utils.isTableLoading.set(true);
    let isFranchiseListCall: boolean = true;
    let isStudentListCall: boolean = false;
    let isInstructorListCall: boolean = false;
    let apiCall = this.franchiseService.getFranchiseByTypeList('1');
    this.setTableColumns('franchise');
    if (this.selectedActivationType === this.activationType.Student) {
      this.setTableColumns('student');
      isFranchiseListCall = false;
      isStudentListCall = true;
      apiCall = this.studentService.getStudentListByFranchiseId(
        this.selectedFranchise.toString()
      );
    } else if (this.selectedActivationType === this.activationType.Instructor) {
      this.setTableColumns('instructor');
      isFranchiseListCall = false;
      isInstructorListCall = true;
      apiCall = this.instructorService.getInstructorListByFranchiseId(
        this.selectedFranchise.toString()
      );
    }
    apiCall.subscribe({
      next: (response) => {
        if (response) {
          this.createTableDataSource(response);
          utils.isTableLoading.set(false);
          this.apiResponse = response;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.isTableLoading.set(false);
        utils.setMessages(error.message, 'error');
      },
    });
  }

  createTableDataSource(response: any) {
    this.tableDataSource = utils.filterDataByColumns(this.colDefs, response);
    this.showGrid = this.tableDataSource.length > 0 ? true : false;
  }

  setTableColumns(entity: 'franchise' | 'student' | 'instructor') {
    let colDefs: any;
    switch (entity) {
      case 'franchise':
        colDefs = this.createFranchiseTableColumns();
        break;
      case 'student':
        colDefs = this.createStudentTableColumns();
        break;
      case 'instructor':
        colDefs = this.createInstructorTableColumns();
        break;
    }
    this.colDefs = colDefs;
  }

  createFranchiseTableColumns() {
    return [
      {
        field: 'franchiseId',
        header: '#Id',
        width: '10%',
        styleClass: 'franchiseId',
      },
      {
        field: 'ownerName',
        header: 'Owner',
        width: '40%',
        styleClass: 'ownerName',
      },
      {
        field: 'franchiseName',
        header: 'Franchise',
        width: '40%',
        styleClass: 'franchiseName',
      },
      {
        field: 'startDate',
        header: 'Start Date',
        width: '20%',
        styleClass: 'startDate',
      },
      {
        field: 'endDate',
        header: 'End Date',
        width: '20%',
        styleClass: 'endDate',
      },
      {
        field: 'status',
        header: 'Status',
        width: '10%',
        styleClass: 'status',
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action',
      },
    ];
  }

  createStudentTableColumns() {
    return [
      {
        field: 'studentId',
        header: '#Id',
        width: '10%',
        styleClass: 'studentId',
      },
      {
        field: 'studentFirstName',
        header: 'First Name',
        width: '20%',
        styleClass: 'studentFirstName',
      },
      {
        field: 'studentLastName',
        header: 'Last Name',
        width: '20%',
        styleClass: 'studentLastName',
      },
      {
        field: 'franchiseName',
        header: 'Franchise',
        width: '20%',
        styleClass: 'franchiseName',
      },
      {
        field: 'startDate',
        header: 'Start Date',
        width: '20%',
        styleClass: 'startDate',
      },
      {
        field: 'endDate',
        header: 'End Date',
        width: '20%',
        styleClass: 'endDate',
      },
      {
        field: 'status',
        header: 'Status',
        width: '10%',
        styleClass: 'status',
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action',
      },
    ];
  }

  createInstructorTableColumns() {
    return [
      {
        field: 'instructorId',
        header: '#Id',
        width: '10%',
        styleClass: 'instructorId',
      },
      {
        field: 'instructorName',
        header: 'Instructor',
        width: '40%',
        styleClass: 'instructorName',
      },
      {
        field: 'franchiseName',
        header: 'Franchise',
        width: '40%',
        styleClass: 'franchiseName',
      },
      {
        field: 'startDate',
        header: 'Start Date',
        width: '20%',
        styleClass: 'startDate',
      },
      {
        field: 'endDate',
        header: 'End Date',
        width: '20%',
        styleClass: 'endDate',
      },
      {
        field: 'status',
        header: 'Status',
        width: '10%',
        styleClass: 'status',
      },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action',
      },
    ];
  }

  handleAddEditAction(data?: any) {
    // if (this.selectedActivationType) {
    //   if (data?.isEditActionLoading || data?.isDeleteActionLoading) {
    //     if (data.hasOwnProperty('isEditActionLoading')) {
    //       delete data.isEditActionLoading;
    //     }
    //     if (data.hasOwnProperty('isDeleteActionLoading')) {
    //       delete data.isDeleteActionLoading;
    //     }
    //   }
    //   let rowData: any;
    //   if (this.selectedActivationType === this.activationType.Franchise && this.apiResponse?.length) {
    //     rowData = this.apiResponse?.find((item: any) => item.franchiseId === data?.franchiseId);
    //   } else if (this.selectedActivationType === this.activationType.Student) {
    //     rowData = this.apiResponse?.find((item: any) => item.studentId === data?.studentId);
    //   } else {
    //     rowData = this.apiResponse?.find((item: any) => item.instructorId === data?.instructorId);
    //   }

    //   this.dialogRef = this.dialogService.open(AddEditActivationComponent, {
    //     data: { ...rowData, activationType: this.selectedActivationType, isEditMode: this.isEditMode },
    //     closable: false,
    //     modal: true,
    //     height: 'auto',
    //     width: utils.isMobile() ? '95%' : '42%',
    //     styleClass: 'add-edit-dialog',
    //     header: this.isEditMode ? `Update Activation For: ${this.selectedActivationType.charAt(0).toUpperCase() + this.selectedActivationType.slice(1)}` : `Add Activation For: ${this.selectedActivationType.charAt(0).toUpperCase() + this.selectedActivationType.slice(1)}`,
    //   });

    //   this.dialogRef.onClose.subscribe((res) => {
    //     if (res) {
    //       if (res?.status) {
    //         utils.setMessages(res.message, 'success');
    //         utils.isTableEditAction.set(false);
    //         this.handleSearchAction();
    //       } else {
    //         utils.isTableEditAction.set(false);
    //         utils.setMessages(res.message, 'error');
    //       }
    //     } else {
    //       utils.isTableEditAction.set(false);
    //     }
    //   })
    // } else {
    //   utils.setMessages('Please Select Activation Type', 'info');
    // }
    this.handleActivateExam();
  }

  // filterExamInfo(examId: number) {
  //   const franchiseItem = this.activationList.filter((item) => item.examId
  //     === examId)[0];
  //   return { ...franchiseItem, isEditMode: this.isEditMode };
  // }

  handleRowDelet(event: any) {
    const deleteItemIndex = this.activationList.findIndex(
      (item) => item?.id === event?.id
    );
    if (deleteItemIndex > -1) {
      this.activationList.splice(deleteItemIndex, 1);
      this.tableDataSource.splice(deleteItemIndex, 1);
      const deleteMessageObj = {
        detail: 'Record deleted successsfully',
        severity: 'success',
        closable: true,
      };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }

  handleTableRefresh(event: any) {
    this.handleSearchAction();
  }

  handleChangeStatus({
    selectedRows,
    isInline,
    multipleStatus,
  }: {
    selectedRows: any[];
    isInline: boolean;
    multipleStatus: string;
  }) {
    if (!isInline) {
      this.handleActivateExam(selectedRows, multipleStatus);
    }
  }

  deleteExamRow(data: any) {
    this.handleRowDelet(data);
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000);
  }

  handleActivateExam(selectedRows?: any, multipleStatus?: any) {
    const payload = {
      activationId: 0,
      objectId:
        this.selectedRows && this.selectedRows.length > 1
          ? 0
          : Number(this.data[0]),
      objectType: this.selectedActivationType,
      status:
        this.selectedRows && this.selectedRows.length > 1
          ? multipleStatus
          : selectedRows[0].status === 'Active'
          ? 'DeActive'
          : 'Active',
    };

    let apiCall =
      this.selectedRows && this.selectedRows.length > 1
        ? this.activationService.saveMultipleActivation({
            data: this.data,
            ...payload,
          })
        : this.activationService.saveActivation(payload);
    apiCall.subscribe({
      next: (response) => {
        if (response) {
          utils.setMessages(response.message, 'success');
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
      },
    });
  }

  onSelectedRowsChange({
    selectedRows,
    isInline,
  }: {
    selectedRows: any[];
    isInline: boolean;
  }) {
    this.selectedRows = selectedRows;
    if (this.selectedActivationType === 'student') {
      const studentIds = selectedRows.map((row: any) => row.studentId);
      this.data = studentIds.join(',');
    }
    if (this.selectedActivationType === 'instructor') {
      const instructorIds = selectedRows.map((row: any) => row.instructorId);
      this.data = instructorIds.join(',');
    }
    if (this.selectedActivationType === 'franchise') {
      const franchiseIds = selectedRows.map((row: any) => row.franchiseId);
      this.data = franchiseIds.join(',');
    }
    this.validActivate = selectedRows.length > 0 ? true : false;
    if (isInline) {
      this.handleActivateExam(selectedRows);
    }
  }

  ngOnDestroy() {
    this.selectedRows = [];
  }
}

export enum ActivationType {
  Franchise = 'franchise',
  Student = 'student',
  Instructor = 'instructor',
}
