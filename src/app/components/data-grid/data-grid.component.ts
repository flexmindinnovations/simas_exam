import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, input, ChangeDetectorRef } from '@angular/core';
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
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNodeExpandEvent } from 'primeng/tree';
import { db } from '../../../db';
import { LoadingComponent } from '../loading/loading.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomCheckboxComponent } from '../custom-checkbox/custom-checkbox.component';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, IconFieldModule, InputIconModule, DynamicDialogModule, TieredMenuModule, TreeTableModule, LoadingComponent, CheckboxModule, CustomCheckboxComponent],
  providers: [DialogService],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent implements OnChanges, AfterViewInit {
  scrollHeight: any = '450px';
  screenHeight: any = window.screen.availHeight;
  screenWidth: any = window.screen.availWidth;
  searchValue: string = '';
  addButtonTitle: string = '';

  isLoading: boolean = false;
  isDeleteActionLoading: boolean = false;
  isEditActionLoading: boolean = false;
  isAddActionLoading: boolean = false;
  isGenerateActionLoading: boolean = false;
  isExportActionLoading: boolean = false;
  showPaginator: boolean = false;
  isMobile: boolean = false;
  isTreeList = input<boolean>(false);

  @ViewChild('dataGrid', { static: false }) dataGrid!: Table;
  @Input({ required: true }) colDefs: any;
  @Input() showAddButton: boolean = true;
  @Input() isGenerate: boolean = false;
  @Input() isCheckbox: boolean = false;
  @Input({ required: false }) childColDefs: any;
  @Input({ required: true }) dataSource: any;
  @Output() onRowDelete: EventEmitter<any> = new EventEmitter();
  @Output() onRowEdit: EventEmitter<any> = new EventEmitter();
  @Output() onAddAction: EventEmitter<any> = new EventEmitter();
  @Output() onGenerateAction: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowsChange: EventEmitter<any[]> = new EventEmitter();

  paginatorPosition = [100, 180];
  dialogRef: DynamicDialogRef | undefined;

  downloadOptions: MenuItem[] = [];
  currentModule: any;
  selectedRoute: any;
  selectedLines: any;
  downloadMenuId = new Date().getTime();
  allRowsSelected: boolean = false;
  selectedRows: any[] = [];

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    if (event) {
      this.screenHeight = window.screen.availHeight;
      this.screenWidth = window.screen.availWidth;
      const position = utils.isMobile() ? this.paginatorPosition[0] : this.paginatorPosition[1];
      this.screenHeight = window.innerHeight;
      this.scrollHeight = this.screenHeight - position;
    } else {
      const position = utils.isMobile() ? this.paginatorPosition[0] : this.paginatorPosition[1];
      this.screenHeight = window.innerHeight;
      this.scrollHeight = this.screenHeight - position;
    }
  }

  constructor(
    private dialogService: DialogService,
    private cdref: ChangeDetectorRef
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
      const rowIndex = utils.onModalClose();
      if (rowIndex > -1) {
        this.dataSource[rowIndex]['isGenerateActionLoading'] = false;
      }
      this.selectedRoute = utils.activeItem();
    })

    effect(() => {
      this.isEditActionLoading = utils.isTableEditAction();
      if (!this.isAddActionLoading) {
        this.dataSource.forEach((item: any) => {
          item['isEditActionLoading'] = false;
          item['isDeleteActionLoading'] = false;
          item['isGenerateActionLoading'] = false;
        });

      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isTreeList()) {
      this.dataSource = this.transformDataToTreeNodes(this.dataSource);
    }

    // Ensure each item has a 'selected' property
    this.dataSource = this.dataSource.map((item: any) => ({
      ...item,
      studentId: item.studentId || item.id, // Make sure studentId exists
      isEditActionLoading: false,
      isDeleteActionLoading: false,
      isGenerateActionLoading: false,
      selected: item.selected || false // Initialize the selected property
    }));
    this.showPaginator = this.dataSource.length > 15;
  }


  ngAfterViewInit(): void {
    const paginatorElement = document.getElementsByClassName('p-paginator-rpp-options')[0];
    if (paginatorElement?.parentElement) {
      paginatorElement.parentElement.style.width = 'auto';
    }

    this.downloadOptions = [
      { label: 'CSV', icon: 'pi pi-file-export', command: () => { this.downloadCsv(); } },
      { label: 'XLSX', icon: 'pi pi-file-excel', command: () => { this.downloadxlxs(); } },
      { label: 'PDF', icon: 'pi pi-file-pdf', command: () => { this.downloadPdf(); } }
    ];
    this.setModulePermissions();
    this.cdref.detectChanges();
  }

  transformDataToTreeNodes(data: any[]): TreeNode[] {
    return data.map(item => {
      const { children, ...rest } = item;
      return {
        ...rest,
        expanded: false,
        children: children ? this.transformDataToTreeNodes(children) : []
      };
    });
  }

  async setModulePermissions() {
    let activeModule: any;
    const permissionList = await db.permissiontem.toArray();
    activeModule = permissionList.find((item: any) => item.moduleName === this.selectedRoute?.moduleName);
    this.currentModule = activeModule;
  }

  toggleRow(rowData: any) {
    rowData.expanded = !rowData.expanded;
  }

  downloadCsv() {
    this.isExportActionLoading = true;
    this.dataGrid.exportCSV();
    this.isExportActionLoading = false;
  }

  downloadxlxs() {
    this.isExportActionLoading = true;
    const dtSource = this.dataSource.map((item: any) => item);
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataSource);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      const fileName = utils.addButtonTitle() + '_export' + new Date().getTime();
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  downloadPdf() {
    this.isExportActionLoading = true;
    const exportCols = this.colDefs.map((col: any) => ({ title: col.header, dataKey: col.field }));
    const doc = new jsPDF('portrait', 'px', 'a4');
    autoTable(doc, { columns: exportCols, body: this.dataSource, });
    const fileName = utils.addButtonTitle() + '_export' + new Date().getTime();
    doc.save(`${fileName}.pdf`);
    this.isExportActionLoading = false;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
      this.isExportActionLoading = false;
    });
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
  }

  handleEditOperation(rowData: any, index: number) {
    this.isEditActionLoading = true;
    this.dataSource.forEach((item: any) => item['isEditActionLoading'] = false);
    this.dataSource[index]['isEditActionLoading'] = true;
    utils.isTableEditAction.set(true);
    utils.tableEditRowData.set(rowData);
  }

  handleDeleteOperation(rowData: any, index: number) {
    this.isDeleteActionLoading = true;
    this.dataSource.forEach((item: any) => item['isDeleteActionLoading'] = false);
    this.dataSource[index]['isDeleteActionLoading'] = true;
    this.cdref.detectChanges();
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

  handleGenerateOperation(rowData: any, rowIndex: any) {
    this.isGenerateActionLoading = true;
    this.dataSource.forEach((item: any) => item['isGenerateActionLoading'] = false);
    this.dataSource[rowIndex]['isGenerateActionLoading'] = true;
    this.onGenerateAction.emit({ rowData, rowIndex });
    this.cdref.detectChanges();
  }

  handleAddAction() {
    this.onAddAction.emit(this.addButtonTitle.toLowerCase());
  }

  getFrozenCols(column: any) {
    return column.field === 'action' ? true : false;
  }

  selectRow(event: Event, rowData: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    rowData.selected = isChecked;

    // Update selectedRows array
    if (isChecked) {
      // Add the rowData to selectedRows if it's checked
      this.selectedRows.push(rowData);
    } else {
      // Remove the rowData from selectedRows if it's unchecked
      this.selectedRows = this.selectedRows.filter(row => row !== rowData);
    }

    // Update allRowsSelected if all rows are now selected
    this.allRowsSelected = this.dataSource.every((row: any) => row.selected);

    // Emit updated selectedRows
    this.selectedRowsChange.emit(this.selectedRows);
  }

  selectAllRows(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Select or deselect all rows
    this.dataSource.forEach((row: any) => {
      row.selected = isChecked;
    });

    // Update selectedRows based on whether all are selected or none are selected
    if (isChecked) {
      this.selectedRows = [...this.dataSource];  // Select all rows
    } else {
      this.selectedRows = [];  // Deselect all rows
    }

    // Update allRowsSelected based on isChecked
    this.allRowsSelected = isChecked;

    // Emit updated selectedRows
    this.selectedRowsChange.emit(this.selectedRows);
  }


}

export interface TableColumn {
  field: string;
  header: string;
  width: string;
  styleClass: string;
}

export interface TreeNode {
  label?: string;
  data?: any;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
}

function handleGenerateOperation(rowData: any, any: any) {
  throw new Error('Function not implemented.');
}

