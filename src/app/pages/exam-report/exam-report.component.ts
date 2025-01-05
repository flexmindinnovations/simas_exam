import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { utils } from '../../utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { DropdownModule, type DropdownChangeEvent } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-exam-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
  providers: [DialogService],
  templateUrl: './exam-report.component.html',
  styleUrl: './exam-report.component.scss'
})
export class ExamReportComponent {

  examTypeList: Array<any> = [];
  levelNameList: Array<any> = [];
  roundNameList: Array<any> = [];
  studentList: Array<any> = [];

  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = false;

  examTypeListLoading: boolean = false;
  levelListLoading: boolean = false;
  roundListLoading: boolean = false;
  studentListLoading: boolean = false;
  isPanelCollapsed: boolean = false;

  selectedExamType: any = undefined;
  selectedLevel: any = undefined;
  selectedRound: any = undefined;
  selectedStudent: any = undefined;

  constructor(
    private examTypeService: ExamTypeService,
    private levelService: LevelService
  ) {

  }

  ngOnInit(): void {
    utils.addButtonTitle.set('Exam Report');
    this.getMasterData();
  }

  getMasterData() {
    utils.isTableLoading.set(true);
    this.examTypeListLoading = true;
    this.levelListLoading = true;
    this.roundListLoading = true;
    const examList = this.examTypeService.getExamTypeList();
    const levelList = this.levelService.getLevelList();
    forkJoin({ examList, levelList }).subscribe({
      next: (response) => {
        if (response) {
          const { examList, levelList } = response;
          if (levelList?.length) this.levelNameList = levelList;
          if (examList?.length) this.examTypeList = examList;
          this.examTypeListLoading = false;
          this.levelListLoading = false;
          this.roundListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.examTypeListLoading = false;
        this.levelListLoading = false;
        this.roundListLoading = false;
      }
    })
  }

  handleOnExamTypeChange(event: DropdownChangeEvent) {
    this.selectedExamType = event?.value;
  }

  handleOnLevelNameChange(event: DropdownChangeEvent) {
    this.roundListLoading = true;
    this.selectedLevel = event?.value;
    const roundList = this.levelNameList.filter((each) => each.levelId === event?.value);
    if (roundList?.length) this.roundNameList = roundList[0]?.examRoundList;
    this.roundListLoading = false;
  }

  handleOnRoundNameChange(event: DropdownChangeEvent) {
    this.selectedRound = event?.value;
  }
  handleSearchAction() {

  }


}
