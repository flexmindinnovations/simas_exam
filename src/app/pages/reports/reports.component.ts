import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, ViewChild, OnInit } from '@angular/core';
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
import { DropdownModule, type DropdownChangeEvent } from 'primeng/dropdown';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { StudentService } from '../../services/student/student.service';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule],
  providers: [DialogService],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  franchiseList: Array<any> = [];
  instructorList: Array<any> = [];
  studentList: Array<any> = [];
  examTypeList: Array<any> = [];
  levelNameList: Array<any> = [];
  roundNameList: Array<any> = [];

  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = false;

  examTypeListLoading: boolean = false;
  franchiseListLoading: boolean = false;
  instructorListLoading: boolean = false;
  studentListLoading: boolean = false;
  levelListLoading: boolean = false;
  roundListLoading: boolean = false;

  selectedFranchise: any = undefined;
  selectedInstructor: any = undefined;
  selectedStudent: any = undefined;
  selectedExamType: any = undefined;
  selectedLevel: any = undefined;
  selectedRound: any = undefined;

  constructor(
    private franchiseService: FranchiseService,
    private instructorService: InstructorService,
    private studentService: StudentService,
    private examTypeService: ExamTypeService,
    private levelService: LevelService
  ) { }

  ngOnInit(): void {
    this.getFranchiseList();
  }

  async getFranchiseList() {
    this.franchiseList = await this.getDropdownData('franchise');
  }

  getDropdownData(src: ReportCriteria): Promise<any> {
    this.toggleLoading(src, true);
    return new Promise((resolve, reject) => {
      let apiCall: Observable<any> | undefined;
      switch (src) {
        case ReportCriteriaText.FRANCHISE:
          apiCall = this.franchiseService.getFranchiseByTypeList('1');
          break;
        case ReportCriteriaText.INSTRUCTOR:
          apiCall = this.instructorService.getInstructorList();
          break;
        case ReportCriteriaText.STUDENT:
          apiCall = this.studentService.getStudentList();
          break;
        case ReportCriteriaText.EXAM_TYPE:
          apiCall = this.examTypeService.getExamTypeList();
          break;
        case ReportCriteriaText.LEVEL:
          apiCall = this.levelService.getLevelList();
          break;
        default:
          reject(new Error('Invalid ReportCriteria'));
          this.toggleLoading(src, false);
          return;
      }
      if (apiCall) {
        apiCall.subscribe({
          next: (response: any) => {
            if (response) {
              resolve(response);
              this.toggleLoading(src, false);
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error) {
              utils.setMessages(error.message, 'error');
              this.toggleLoading(src, false);
            }
          }
        })
      }
    })
  }

  async handleListItemChange(event: DropdownChangeEvent, src: ReportCriteria) {
    const value = event.value;
    switch (src) {
      case ReportCriteriaText.FRANCHISE:
        this.selectedFranchise = value;
        this.instructorList = await this.getDropdownData('instructor');
        break;
      case ReportCriteriaText.INSTRUCTOR:
        this.selectedInstructor = value;
        const studentList = await this.getDropdownData('student');
        this.studentList = studentList.map((item: any) => {
          item['fullName'] = item?.studentFirstName + ' ' + item?.studentLastName;
          return item;
        })
        break;
      case ReportCriteriaText.STUDENT:
        this.selectedStudent = value;
        this.examTypeList = await this.getDropdownData('examType');
        break;
      case ReportCriteriaText.EXAM_TYPE:
        this.selectedExamType = value;
        this.levelNameList = await this.getDropdownData('level');
        break;
      case ReportCriteriaText.LEVEL:
        this.selectedLevel = value;
        this.roundListLoading = true;
        this.selectedLevel = event?.value;
        const roundList = this.levelNameList.filter((each) => each.levelId === value);
        if (roundList?.length) this.roundNameList = roundList[0]?.examRoundList;
        this.roundListLoading = false;
        break;
      case ReportCriteriaText.ROUND:
        this.selectedRound = value;
        break;
    }
  }

  handleSearchAction() {

  }

  toggleLoading(listName: ReportCriteria | null = null, isLoading: boolean) {
    this.examTypeListLoading = false;
    this.franchiseListLoading = false;
    this.instructorListLoading = false;
    this.studentListLoading = false;
    this.levelListLoading = false;
    this.roundListLoading = false;
    if (listName === null) {
      this.examTypeListLoading = isLoading;
      this.franchiseListLoading = isLoading;
      this.instructorListLoading = isLoading;
      this.studentListLoading = isLoading;
      this.levelListLoading = isLoading;
      this.roundListLoading = isLoading;
    } else {
      switch (listName) {
        case 'examType':
          this.examTypeListLoading = isLoading;
          break;
        case 'franchise':
          this.franchiseListLoading = isLoading;
          break;
        case 'instructor':
          this.instructorListLoading = isLoading;
          break;
        case 'student':
          this.studentListLoading = isLoading;
          break;
        case 'level':
          this.levelListLoading = isLoading;
          break;
        case 'round':
          this.roundListLoading = isLoading;
          break;
        default:
          console.error('Invalid list name');
      }
    }
  }
}

type ReportCriteria = 'franchise' | 'instructor' | 'student' | 'examType' | 'level' | 'round';

enum ReportCriteriaText {
  FRANCHISE = 'franchise',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  EXAM_TYPE = 'examType',
  LEVEL = 'level',
  ROUND = 'round',
}
