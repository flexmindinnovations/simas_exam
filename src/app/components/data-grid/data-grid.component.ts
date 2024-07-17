import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { utils } from '../../utils';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteConfirmComponent } from '../../modals/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, IconFieldModule, InputIconModule, DynamicDialogModule],
  providers: [DialogService],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent implements OnChanges, AfterViewInit {
  scrollHeight: string = '450px';
  screenHeight: any;
  searchValue: string = '';
  addButtonTitle: string = '';

  isLoading: boolean = false;
  isDeleteActionLoading: boolean = false;
  isEditActionLoading: boolean = false;
  isAddActionLoading: boolean = false;

  @ViewChild('dataGrid', { static: false }) dataGrid!: Table;
  @Input({ required: true }) colDefs: any;
  @Input({ required: true }) dataSource: any;
  @Output() onRowDelete: EventEmitter<any> = new EventEmitter();
  @Output() onRowEdit: EventEmitter<any> = new EventEmitter();
  @Output() onAddAction: EventEmitter<any> = new EventEmitter();
  paginatorPosition = [200, 220];
  isMobile: boolean = false;
  dialogRef: DynamicDialogRef | undefined;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    if (event) {
      const position = utils.isMobile() ? this.paginatorPosition[0] : this.paginatorPosition[1];
      this.screenHeight = window.innerHeight;
      this.scrollHeight = this.screenHeight - position + 'px';
    } else {
      const position = utils.isMobile() ? this.paginatorPosition[0] : this.paginatorPosition[1];
      this.screenHeight = window.innerHeight;
      this.scrollHeight = this.screenHeight - position + 'px';
    }
  }

  constructor(
    private dialogService: DialogService
  ) {
    this.getScreenSize();

    effect(() => {
      this.isMobile = utils.isMobile();
    })

    effect(() => {
      this.addButtonTitle = utils.addButtonTitle();
    })

    effect(() => {
      this.isLoading = utils.isTableLoading();
    })
    effect(() => {
      this.isAddActionLoading = utils.isAddActionLoading();
    })

    effect(() => {
      this.isEditActionLoading = utils.isTableEditAction();
      if (!this.isAddActionLoading) {
        this.dataSource.forEach((item: any) => {
          item['isEditActionLoading'] = false;
          item['isDeleteActionLoading'] = false;
        });

      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataSource = this.dataSource.map((item: any) => {
      item['isEditActionLoading'] = false;
      item['isDeleteActionLoading'] = false;
      return item;
    });
    this.dataSource = dataSource;
  }

  ngAfterViewInit(): void {
    const paginatorElement = document.getElementsByClassName('p-paginator-rpp-options')[0];
    if (paginatorElement?.parentElement) {
      paginatorElement.parentElement.style.width = 'auto';
    }
  }

  onFilterValueChange(event: Event) {
    const input = event?.target as HTMLInputElement;
    this.dataGrid.filterGlobal(input.value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  getGlobalFilters() {
    const filters = this.colDefs.filter((item: any) => item.field !== 'action').map((item: any) => item.field);
    return filters;
  }

  handleRowSelect(event: any) {
    console.log('event handleRowSelect: ', event);

  }

  handleEditOperation(rowData: any) {
    this.isEditActionLoading = true;
    this.dataSource.forEach((item: any) => item['isEditActionLoading'] = false);
    const rowIndex = this.dataSource.findIndex((row: any) => row.franchiseId === rowData.franchiseId);
    if (rowIndex > -1) {
      this.dataSource[rowIndex]['isEditActionLoading'] = true;
    }
    utils.isTableEditAction.set(true);
    utils.tableEditRowData.set(rowData);
  }

  handleDeleteOperation(rowData: any) {
    this.isDeleteActionLoading = true;
    this.dataSource.forEach((item: any) => item['isDeleteActionLoading'] = false);
    const rowIndex = this.dataSource.findIndex((row: any) => row.franchiseId === rowData.franchiseId);
    if (rowIndex > -1) {
      this.dataSource[rowIndex]['isDeleteActionLoading'] = true;
    }
    this.dialogRef = this.dialogService.open(DeleteConfirmComponent, {
      data: rowData,
      closable: false,
      modal: true,
      width: utils.isMobile() ? '95%' : '25%',
      styleClass: 'delete-confirm-dialog',
      header: 'Confirm Delete',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        this.onRowDelete.emit(res);
        this.isDeleteActionLoading = false;
      } else {
        this.dataSource.forEach((item: any) => {
          item['isEditActionLoading'] = false;
          item['isDeleteActionLoading'] = false;
        });
        this.isDeleteActionLoading = false;
      }
    })
  }

  handleAddAction() {
    this.onAddAction.emit(this.addButtonTitle.toLowerCase());
  }

  getFrozenCols(column: any) {
    return column.field === 'action' ? true : false;
  }
}

export interface TableColumn {
  field: string;
  header: string;
  width: string;
  styleClass: string;
}