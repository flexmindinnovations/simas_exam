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
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ReportsService } from '../../services/reports/reports.service';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
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
  isPanelCollapsed: boolean = false;

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
    private levelService: LevelService,
    private reportService: ReportsService
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
          const payloadByFranchiseIdAndInstructorId = {
            franchiseId: this.selectedFranchise,
            instructorId: this.selectedInstructor
          }
          apiCall = this.reportService.getStudentListFromExamPaperFranchiseAndInstructorWise(payloadByFranchiseIdAndInstructorId);
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
    let studentInfo: any;
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
        });
        break;
      case ReportCriteriaText.STUDENT:
        this.selectedStudent = value;
        studentInfo = this.studentList.find((student: any) => student.studentId === this.selectedStudent);
        if (studentInfo) {
          this.examTypeList = studentInfo?.examTypeList;
        }
        break;
      case ReportCriteriaText.EXAM_TYPE:
        if (this.selectedStudent > 0) {
          this.selectedExamType = value;
          studentInfo = this.studentList.find((student: any) => student.studentId === this.selectedStudent);
          if (studentInfo) {
            this.levelNameList = studentInfo?.levelList;
          }
        }
        break;
      case ReportCriteriaText.LEVEL:
        if (this.selectedStudent > 0) {
          studentInfo = this.studentList.find((student: any) => student.studentId === this.selectedStudent);
          if (studentInfo) {
            this.roundNameList = studentInfo?.roundList;
          }
        }
        break;
      case ReportCriteriaText.ROUND:
        this.selectedRound = value;
        break;
    }
  }

  handleSearchAction() {
    // this.isSearchActionLoading = true;
    const payload = {
      selectedFranchise: this.selectedFranchise ?? 0,
      selectedInstructor: this.selectedInstructor ?? 0,
      selectedStudent: this.selectedStudent ?? 0,
      selectedExamType: this.selectedExamType ?? 0,
      selectedLevel: this.selectedLevel ?? 0,
      selectedRound: this.selectedRound ?? 0,
    }
    const payloadByFranchiseIdAndInstructorId = {
      franchiseId: payload.selectedFranchise,
      instructorId: payload.selectedInstructor
    }
    // const apiCall = this.reportService.getStudentListFromExamPaperFranchiseAndInstructorWise(payloadByFranchiseIdAndInstructorId);
    // apiCall.subscribe({
    //   next: (response: any) => {
    //     console.log('response: ', response);

    //     this.isSearchActionLoading = false;
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.isSearchActionLoading = false;
    //     utils.setMessages(error.message, 'error');
    //   }
    // })
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
        case ReportCriteriaText.EXAM_TYPE:
          this.examTypeListLoading = isLoading;
          break;
        case ReportCriteriaText.FRANCHISE:
          this.franchiseListLoading = isLoading;
          break;
        case ReportCriteriaText.INSTRUCTOR:
          this.instructorListLoading = isLoading;
          break;
        case ReportCriteriaText.STUDENT:
          this.studentListLoading = isLoading;
          break;
        case ReportCriteriaText.LEVEL:
          this.levelListLoading = isLoading;
          break;
        case ReportCriteriaText.ROUND:
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
