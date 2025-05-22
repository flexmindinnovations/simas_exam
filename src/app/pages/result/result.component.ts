import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DataGridComponent, TableColumn } from '../../components/data-grid/data-grid.component';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { CompetitionService } from '../../services/competition/competition.service';
import { LevelService } from '../../services/level/level.service';
import { SharedService } from '../../services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Student {
  studentId: number;
  studentFirstName: string;
  studentMiddleName: string;
  studentLastName: string;
  levelName: string;
  bonusMark: number;
  totalMark: number;
  totalWithBonusMark: number;
  outOfMark: number;
  ageGroupName: string;
  rank: string;
  studentPhoto?: string;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DataGridComponent,
    DropdownModule,
    PanelModule,
    ChipModule
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})

export class ResultComponent {
  colDefs: Array<TableColumn> = [];
  tableDataSource: any[] = [];
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = true;
  examOptions: any[] = [];
  selectedExamOption: string = 'all';
  selectedExamControlOption: string = '';
  selectedExamType: string = '';
  selectedLevel: string = '';
  isPanelCollapsed: boolean = false;
  formSearch !: FormGroup;
  levelList: any[] = [];
  isLevelListLoading: boolean = false;
  isCompetitionListLoading: boolean = false;
  competitionList: any[] = [];
  selectedCompetition: string = '';

  championOfChampion: Student | null = null;
  competitionChampions: Student[] = [];
  firstPrizeWinners: Student[] = [];
  secondPrizeWinners: Student[] = [];
  thirdPrizeWinners: Student[] = [];



  constructor(
    private levelService: LevelService,
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initFormGroups();
    this.getCompetitionList();
    this.getLevelList();
    this.setTableColumns();
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      const compId = params['competitionId'];
      if (compId) {
        this.selectedCompetition = compId;
        this.formSearch.patchValue({ competitionId: parseInt(compId) });
      }
      this.router.navigateByUrl(`result?competitionId=${compId}`);
    })
  }

  getCompetitionList() {
    this.isCompetitionListLoading = true;
    this.competitionService.getCompetitionList().subscribe({
      next: (response) => {
        if (response) {
          this.competitionList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.competitionList);
        }
        this.isCompetitionListLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isCompetitionListLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }
  initFormGroups() {
    this.formSearch = this.fb.group({
      competitionId: ['', [Validators.required]],
      levelId: ['', [Validators.required]],
    });
  }

  getLevelList() {
    utils.isTableLoading.set(true);
    this.levelService.getLevelList().subscribe({
      next: (response: any) => {
        if (response) {
          this.levelList = response;
          this.tableDataSource = utils.filterDataByColumns(this.colDefs, this.levelList);
          this.tableDataSource = response.map((item: any) => {
            const children = item?.examRoundList.filter((child: any) => child.levelId === item?.levelId);
            item['children'] = children;
            delete item['examRoundList'];
            return item;
          })
        }
      },
      error: (error: HttpErrorResponse) => {
        // utils.isTableLoading.update(val => !val);
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleOnLevelChange(event: DropdownChangeEvent) {
    this.selectedLevel = event.value;
    this.isSearchDisabled = this.selectedLevel === '';
  }

  handleOnCompetitionChange(event: DropdownChangeEvent) {
    this.selectedCompetition = event.value;
    this.isSearchDisabled = this.selectedCompetition === '';
  }



  setTableColumns() {
    this.colDefs = [
      { field: 'studentId', header: 'Id', width: '5%', styleClass: 'studentId' },
      { field: 'studentFullName', header: 'Student FullName', width: '10%', styleClass: 'studentFullName' },
      { field: 'compititionName', header: 'Compitition Name', width: '10%', styleClass: 'compititionName' },
      { field: 'levelName', header: 'Level Name', width: '10%', styleClass: 'levelName' },
      { field: 'hallTicketNumber', header: 'Hall Ticket Number', width: '5%', styleClass: 'hallTicketNumber' },
      // { field: 'levelId', header: 'Level Id', width: '3%', styleClass: 'levelId' },
      { field: 'compititionId', header: 'Compitition Id', width: '5%', styleClass: 'compititionId' },
      { field: 'ageGroupName', header: 'Age Group Name', width: '5%', styleClass: 'ageGroupName' },
      { field: 'bonusMark', header: 'Bonus Mark', width: '5%', styleClass: 'bonusMark' },
      { field: 'round1Mark', header: 'Round 1', width: '5%', styleClass: 'round1Mark' },
      { field: 'round2Mark', header: 'Round 2', width: '5%', styleClass: 'round2Mark' },
      { field: 'round3Mark', header: 'Round 3', width: '5%', styleClass: 'round3Mark' },
      { field: 'totalObtainMark', header: 'Total Obtain Mark', width: '5%', styleClass: 'totalObtainMark' },
      { field: 'outOfMark', header: 'OutOf Mark', width: '5%', styleClass: 'outOfMark' },
      { field: 'grandTotal', header: 'Grand Total', width: '5%', styleClass: 'grandTotal' },
      { field: 'prize', header: 'Prize', width: '5%', styleClass: 'prize' },
      {
        field: 'action',
        header: 'Action',
        width: '10%',
        styleClass: 'action'
      }
    ];
  }

  handleSearchAction() {
    this.sharedService.getDisplayResultListCompititionAndLevelWise(this.selectedCompetition, this.selectedLevel).subscribe({
      next: (response: any) => {
        this.populateResults(response)
      },
      error: (error: HttpErrorResponse) => {
        this.isSearchActionLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }

  populateResults(students: Student[]): void {
    this.championOfChampion = null;
    this.competitionChampions = [];
    this.firstPrizeWinners = [];
    this.secondPrizeWinners = [];
    this.thirdPrizeWinners = [];

    for (const student of students) {
      student.studentPhoto = student.studentPhoto === null ? '/images/logo1.png' : `https://comp.simasacademy.com/${student.studentPhoto}`;

      switch (student.rank) {
        case 'Champion of Champion':
          this.championOfChampion = student;
          break;
        case 'Champion':
          this.competitionChampions.push(student);
          break;
        case '1st Prize':
          this.firstPrizeWinners.push(student);
          break;
        case '2nd Prize':
          this.secondPrizeWinners.push(student);
          break;
        case '3rd Prize':
          this.thirdPrizeWinners.push(student);
          break;
      }
    }
  }

}
