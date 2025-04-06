import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { ExamCenterService } from '../../services/exam-center/exam-center.service';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { HallticketService } from '../../services/hallticket/hallticket.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HallticketModalComponent } from '../../modals/hallticket-modal/hallticket-modal.component';
import { CompetitionService } from '../../services/competition/competition.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-hallticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, DataGridComponent, DropdownModule, PanelModule, ChipModule],
  providers: [DialogService],
  templateUrl: './hallticket.component.html',
  styleUrl: './hallticket.component.scss'
})
export class HallticketComponent {
  colDefs: any[] = [];
  tableDataSource: any[] = [];
  franchiseList: any[] = [];
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  isFranchiseListLoading: boolean = false;
  isInstructorListLoading: boolean = false;
  isExamCenterLoading: boolean = false;
  isBatchTimeLoading: boolean = false;
  selectedFranchise: string = '';
  instructorList: any[] = [];
  examCenterList: any[] = [];
  batchTimeList: any[] = [];
  selectedInstructor: string = '';
  selectedExamCenter: string = '';
  selectedBatchTime: string = '';
  isPanelCollapsed: boolean = false;
  formGroup!: FormGroup;
  hallTicketList: any[] = [];
  showGrid: boolean = false;
  dialogRef: DynamicDialogRef | undefined;
  competitionList: any[] = [];
  isCompetitionListLoading: boolean = false;
  selectedCompetiton: string = '';

  hallTicketData = {
    competitionName: 'SIMAS ACADEMY',
    hallTicketNumber: 'HT123456',
    group: 'A1',
    level: 'Intermediate',
    studentPhoto: '/images/logo1.png',
    studentName: 'John Doe',
    center: 'Main Center',
    instructorName: 'Jane Smith',
    examCenter: 'Exam Hall 1',
    batchDate: new Date(),
    website: 'www.simasacademy.com',
    email: 'info@simasacademy.com'
  };

  constructor(
    private franchiseService: FranchiseService,
    private instructorService: InstructorService,
    private examCenterService: ExamCenterService,
    private hallticketService: HallticketService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private competitionService: CompetitionService,
  ) {

  }

  ngOnInit(): void {
    this.initFormGroup();
    this.getFranchiseList();
    this.getExamCenterList();
    this.getCompetitionList();
    utils.addButtonTitle.set('Download All');
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      compititionId: ['', [Validators.required]],
      franchiseId: ['', [Validators.required]],
      instructorId: ['', [Validators.required]],
      // examCenterId: ['', [Validators.required]],
      // batchTimeSlotId: ['', [Validators.required]]
    })
  }

  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'studentFullName', header: 'Full Name', width: '30%', styleClass: 'studentFullName' },
      { field: 'instructorName', header: 'Instructor', width: '20%', styleClass: 'instructorName' },
      // { field: 'franchiseName', header: 'Franchise', width: '20%', styleClass: 'franchiseName' },
      { field: 'levelName', header: 'Level', width: '20%', styleClass: 'levelName' },
      // { field: 'mobileNo', header: 'Mobile Number', width: '10%', styleClass: 'mobileNo' },
      // { field: 'status', header: 'Status', width: '20%', styleClass: 'status' },
      // { field: 'studentLastName', header: 'Last Name', width: '20%', styleClass: 'studentLastName' },
      // { field: 'emailId', header: 'Email', width: '15%', styleClass: 'emailId' },
      // { field: 'dob', header: 'DOB', width: '10%', styleClass: 'dob' },
      // { field: 'schoolName', header: 'School Name', width: '20%', styleClass: 'schoolName' },
      // { field: 'standard', header: 'Standard', width: '20%', styleClass: 'Standard' },
      // { field: 'franchiseTypeName', header: 'Franchise Type', width: '15%', styleClass: 'franchiseTypeName' },
      {
        field: 'action',
        header: 'Action',
        width: '20%',
        styleClass: 'action'
      }
    ];
  }

  getCompetitionList() {
    this.competitionService.getCompetitionList().subscribe({
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


  getFranchiseList() {
    utils.isTableLoading.set(true);
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
        // utils.setMessages(error.message, 'error');
      }
    })

  }
  getInstructorList(franchiseId: any) {
    utils.isTableLoading.set(true);
    this.isInstructorListLoading = true;
    this.instructorService.getInstructorListByFranchiseId(franchiseId).subscribe({
      next: (response) => {
        if (response) {
          this.instructorList = response;
          this.isInstructorListLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isInstructorListLoading = false;
        // utils.setMessages(error.message, 'error');
      }
    })
  }
  getExamCenterList() {
    utils.isTableLoading.set(true);
    const apiCall = this.examCenterService.getExamCenterList();
    apiCall.subscribe({
      next: (response: any) => {
        if (response) {
          this.examCenterList = response;
          // this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.examCenterList);
          this.examCenterList = response.map((item: any) => {
            const children = item?.batchTimeSlotList.filter((child: any) => child.examCenterId === item?.examCenterId);
            item['children'] = children;
            delete item['batchTimeSlotList'];
            return item;
          })
          // utils.isTableLoading.update(val => !val);
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

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedCompetiton !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }

  handleOnFranchiseChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedFranchise !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
    this.getInstructorList(event?.value);
  }
  handleAddEditAction() {
    console.log("download All")
  }
  handleSearchAction() {
    this.setTableColumns();
    utils.isTableLoading.set(true);
    if (this.formGroup.valid) {
      this.hallticketService.getStudentHallTicketList(this.formGroup.value).subscribe({
        next: (respones) => {
          if (respones) {
            // console.log(respones);
            this.hallTicketList = respones;
            // this.hallTicketList = respones.map((item: any) => {
            //   item['fullName'] = item['studentFirstName'] + " " + item['studentLastName'];
            //   return item;
            // });
            this.tableDataSource = this.hallTicketList;
            this.showGrid = this.tableDataSource.length > 1 ? true : false;
            // utils.isTableLoading.update(val => !val);
          }
        },
        error: (error: HttpErrorResponse) => {
          utils.setMessages(error.message, 'error');
          // utils.isTableLoading.update(val => !val);
        }
      })
    }
  }
  handleOnInstructorNameChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedInstructor !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }
  handleOnExamCenterChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedExamCenter !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
    this.batchTimeList = this.examCenterList.filter((child: any) => child?.examCenterId === event?.value)[0]?.children;
  }

  handleOnBatchTimeChange(event: DropdownChangeEvent) {
    this.colDefs = [];
    this.tableDataSource = [];
    if (this.selectedExamCenter !== '') {
      this.isSearchDisabled = false;
    } else {
      this.isSearchDisabled = true;
    }
  }

  handleGenerateOperation(data: any) {
    // const { rowData, rowIndex } = data;
    // this.dialogRef = this.dialogService.open(HallticketModalComponent, {
    //   data: rowData,
    //   closable: false,
    //   modal: true,
    //   width: utils.isMobile() ? '95%' : '28%',
    //   styleClass: 'hallticket-dialog',
    //   header: 'Admit Card',
    // });
    // this.dialogRef.onClose.subscribe((res: any) => {
    //   utils.onModalClose.set(rowIndex)
    // })
    const printContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        #printSection {
          width: 900px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          border: 1px solid #000;
          padding: 8px;
          vertical-align: middle;
          text-align: left;
        }
        .center {
          text-align: center;
        }
        .photo-cell {
          text-align: center;
          font-weight: bold;
        }
        .gray-header {
          background-color: #ccc;
          font-weight: bold;
        }
        .student-photo {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border: 1px solid #000;
        }
      </style>
    </head>
    <body>
      <div id="printSection">
        <table>
          <tr>
            <td>Competition Name</td>
            <td colspan="3" class="center"><strong>SIMAS ACADEMY</strong></td>
          </tr>
          <tr>
            <td>Hall Ticket Number</td>
            <td>${this.hallTicketData.hallTicketNumber}</td>
            <td>Group</td>
            <td>${this.hallTicketData.group}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td colspan="3">${this.hallTicketData.level}</td>
          </tr>
          <tr>
            <td class="photo-cell" rowspan="6">
              Student Photo<br/><br>
              <img src="${this.hallTicketData.studentPhoto}" class="student-photo" alt="Photo" />
            </td>
            <td class="gray-header">Student Name</td>
            <td class="gray-header" colspan="2">${this.hallTicketData.studentName}</td>
          </tr>
          <tr>
            <td>Center (franchise Name)</td>
            <td colspan="2">${this.hallTicketData.center}</td>
          </tr>
          <tr>
            <td>Instructor Name</td>
            <td colspan="2">${this.hallTicketData.instructorName}</td>
          </tr>
          <tr>
            <td>Exam Center</td>
            <td colspan="2">${this.hallTicketData.examCenter}</td>
          </tr>
          <tr>
            <td>Batch Date & Time</td>
            <td colspan="2">${this.hallTicketData.batchDate.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" class="center"><strong>Website & Email</strong><br>${this.hallTicketData.website} | ${this.hallTicketData.email}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    `;


    // Create a new iframe for download
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Wait for the iframe content to be rendered
      setTimeout(() => {
        html2canvas(iframeDoc.getElementById('printSection')!).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('hall_ticket.pdf'); // Download the PDF

          // Clean up: remove the iframe
          document.body.removeChild(iframe);
        });
      }, 100); // Delay to ensure the content is fully rendered
    }
  }


}