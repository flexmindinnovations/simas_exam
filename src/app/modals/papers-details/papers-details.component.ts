import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-papers-details',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './papers-details.component.html',
  styleUrls: ['./papers-details.component.scss']
})
export class PapersDetailsComponent implements OnInit {

  dialogData: any;
  item: any;
  columnHeaders: string[] = [];
  tableData: any[] = [];

  constructor(
    private dialogRef: DynamicDialogRef, // ✅ Inject dialog reference
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.item = this.dialogData?.paperDetails;

    if (this.item?.list) {
      this.processTableData();
    }
  }

  processTableData() {
    if (!this.item?.list) return;

    this.columnHeaders = Object.keys(this.item.list[0])
      .filter(key => key.startsWith('row'));

    this.tableData = this.item.list.map((row: any) => ({
      round: row.roundName,
      values: this.columnHeaders.map(col => row[col] || '-'),
      actualAnswer: row.correctAnswer || '-',
      studentAnswer: row.studentGivenAnswer || '-'
    }));
  }

  // ✅ Close Modal
  closeModal() {
    this.dialogRef.close(); // Closes the PrimeNG dynamic dialog
  }
}
