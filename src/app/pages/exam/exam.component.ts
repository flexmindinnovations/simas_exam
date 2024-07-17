import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { utils } from '../../utils';
import { FormsModule } from '@angular/forms';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { Message } from 'primeng/api';
@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent implements OnInit {

  cols: any[] = [];
  products: any[] = [];
  searchValue: string = '';
  @ViewChild('examListTable', { static: false }) examListTable!: Table;

  constructor() {
    effect(() => {
      const isDeleteAction = utils.isTableDeleteAction();
      if (isDeleteAction) {
        this.deleteExamRow(utils.tableDeleteRowData());
      }
    })

  }

  ngOnInit(): void {

  }

  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.examListTable.filterGlobal(input.value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  handleRowDelet(event: any) {
    const deleteItemIndex = this.products.findIndex((item) => item?.id === event?.id);
    if (deleteItemIndex > -1) {
      this.products.splice(deleteItemIndex, 1);
      const deleteMessageObj = { detail: 'Record deleted successsfully', severity: 'success', closable: true };
      utils.messages.update((val: Message[]) => [...val, deleteMessageObj]);
    }
  }

  deleteExamRow(data: any) {
    console.log('data deleteExamRow: ', data);
    setTimeout(() => {
      utils.isTableDeleteAction.set(false);
    }, 2000)
  }
}
