import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TimerComponent } from '../../components/timer/timer.component';
import {
  QuestionItem,
  QuestionPanelComponent,
} from '../../components/question-panel/question-panel.component';
import { ExamPaperService } from '../../services/exam-paper/exam-paper.service';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';
import {
  concatMap,
  delay,
  filter,
  finalize,
  forkJoin,
  from,
  interval,
  last,
  map,
  of,
  Subscription,
  switchMap,
  take,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { utils } from '../../utils';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ExamResultComponent } from '../../modals/exam-result/exam-result.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { NavigationStart, Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { AudioService } from '../../services/audio.service';
import { TimerService } from '../../services/timer.service';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DropdownModule,
    TimerComponent,
    QuestionPanelComponent,
    SelectButtonModule,
    RadioButtonModule,
    ProgressBarModule,
    ConfirmPopupModule,
    PanelModule,
    InputTextModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './student-exam.component.html',
  styleUrl: './student-exam.component.scss',
  animations: [
    trigger('scaleUp', [
      state('void', style({ opacity: '0', transform: 'scale(0)' })),
      state('scaled', style({ opacity: '1', transform: 'scale(1)' })),
      transition(
        'void => scaled',
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
      transition(
        'scaled => void',
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
    ]),
    trigger('scaleUpQuestion', [
      state('void', style({ opacity: '0', transform: 'translateX(-150px)' })),
      state('scaled', style({ opacity: '1', transform: 'translateX(0)' })),
      transition(
        'void => scaled',
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
      transition(
        'scaled => void',
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ),
    ]),
  ],
})
export class StudentExamComponent implements OnInit, AfterViewInit, OnDestroy {
  isSearchActionLoading: boolean = false;
  isSearchDisabled: boolean = false;
  isExamTypeListLoading: boolean = false;
  isLevelListLoading: boolean = false;
  isRoundListLoading: boolean = false;
  isColumnListLoading: boolean = false;
  isRowsListLoading: boolean = false;
  isSpeedListLoading: boolean = false;
  isPanelCollapsed: boolean = false;

  examStarted: boolean = false;

  examTypeList: any[] = [];
  levelList: any[] = [];
  roundList: any[] = [];
  noOfColumnList: any[] = [];
  noOfRowsList: any[] = [];
  questionSpeedList: any[] = [];

  questionList: any[] = [];

  examOptions: any[] = [];
  examControls: any[] = [];

  selectedExamOption: string = 'all';
  selectedExamControlOption: string = '';
  selectedExamType: string = '';
  selectedLevel: string = '';
  selectedRound: string = '';
  selectedNoOfColumn: string = '';
  selectedNoOfRows: string = '';
  selectedSpeedOfQuestion: any = '1';
  activeQuestion: any;
  activeQuestionIndex: number = 0;
  state: string = 'void';
  checkBoxstate: string = 'void';

  questionDuration: any = 3600;
  correctAnswer: any;
  questionType: string = '';
  flashQuestions: string[] = [];

  currentIndex: any;
  currentItem: string | null = null;
  isAnswerSubmitted: boolean = false;
  isWrongAnswer: boolean = false;
  isFlashEnded: boolean = false;
  isLoadingQuestion: boolean = false;
  quizCompleted: boolean = false;

  isSubmitClicked: boolean = false;
  isNextClicked: boolean = false;
  isEndClicked: boolean = false;
  isNextRoundClicked: boolean = false;

  levelDisabled: boolean = false;

  options: any[] = [];
  selectedOptions: Set<number> = new Set();
  selectedAnswer: any;
  flashQuestionsString: any;
  modifiedFlashQuestionsString: any;
  submitedlashQuestionsIndex: number = 0;

  questionInterval: any;

  dialogRef: DynamicDialogRef | undefined;

  totalTime: number = 10; // in seconds
  questionTimer: any = '0';
  remainingTime: number = this.totalTime;
  elapsedTime: number = this.remainingTime;
  subscription: Subscription = new Subscription();

  isWarningPhase: boolean = false;
  isDangerPhase: boolean = false;

  showAnswer: boolean = false;

  isSidebarOpened: boolean = false;
  resizeObserver: any;
  resizeListener: any;
  timeLeft: any;
  totalElapsedTime: any;
  isMobile: boolean = false;
  NoDataFound: boolean = false;
  roundIds: string[] = [];
  questionListAll: any[] = [];
  groupedQuestions: { [key: string]: any[] } = {};
  currentRoundIndex = 0;
  roundHeader: string = '';
  canMoveToNextRound = false;
  isFocused: boolean = false;
  focusTriggered = false;
  showNextRoundButton: boolean = true;
  isFinalExam: boolean = false;

  @ViewChild('exampOptionsCard') exampOptionsCard!: ElementRef;
  @ViewChild('answerInput') answerInput!: ElementRef;

  constructor(
    private examTypeService: ExamTypeService,
    private levelService: LevelService,
    private dialogService: DialogService,
    private el: ElementRef,
    private questionBankService: QuestionBankService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
    private host: ElementRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private audioService: AudioService,
    private timerService: TimerService,
    private questionService: QuestionService,
  ) {
    effect(() => {
      this.isSidebarOpened = utils.sideBarOpened();
    });

    effect(() => {
      this.isMobile = utils.isMobile();
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.audioService.cleanupSounds();
      });

    this.initAudio();
    this.getMasterData();
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      if (!this.isMobile) {
        window.location.reload();
      }
    });
  }

  initAudio() {
    this.audioService.loadSound('submit', '/audio/next.mp3');
    this.audioService.loadSound('next', '/audio/next.mp3');
    this.audioService.loadSound('end', '/audio/next.mp3');
    this.audioService.loadSound('count', '/audio/count.mp3');
    this.audioService.loadSound('simple', '/audio/simple.mp3');
    this.audioService.loadSound('next1', '/audio/next1.mp3');
    this.audioService.loadSound('error', '/audio/error.mp3');
  }

  get filteredExamControls() {
    return this.examControls.filter(control =>
      control.value !== 'round' || (this.canMoveToNextRound && this.currentRoundIndex < this.roundIds.length - 1)
    );
  }

  ngAfterViewInit(): void {
    this.setTimerWidth();
  }


  setTimerWidth() {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const exampOptionsCard: any =
            document.querySelector('.exampOptionsCard');
          if (exampOptionsCard) {
            const siblingWidth = exampOptionsCard.offsetWidth;
            const questionCard: any = document.getElementById('questionCard');
            const questionResultContainer: any = document.getElementById(
              'questionResultContainer'
            );
            questionCard.style.width = siblingWidth + 'px';
            questionResultContainer.style.width = siblingWidth - 1 + 'px';
            observer.disconnect();
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }


  getMasterData() {
    this.isExamTypeListLoading = true;
    this.isLevelListLoading = true;
    this.isColumnListLoading = true;
    this.isRowsListLoading = true;
    this.isSpeedListLoading = true;
    const examList$ = this.examTypeService.getExamTypeList();
    const levelList$ = this.levelService.getLevelList();
    forkJoin({ examList: examList$, levelList: levelList$ }).subscribe({
      next: (response) => {
        if (response) {
          const { examList, levelList } = response;
          this.levelList = levelList;
          this.examTypeList = examList;
          if (examList.length) this.isExamTypeListLoading = false;
          if (levelList.length) this.isLevelListLoading = false;
          const roleName = sessionStorage.getItem('role') || '';
          const secretKey = sessionStorage.getItem('token') || '';
          if (roleName) {
            const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
            if (role === 'student') {
              const studentDetails = utils.studentDetails();
              if (studentDetails.hasOwnProperty('levelId') && studentDetails.levelId > 0) {
                this.selectedLevel = studentDetails.levelId;
                this.levelDisabled = true;
              }
            }
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.isExamTypeListLoading = false;
        this.isLevelListLoading = false;
      },
    });

    for (let i = 1; i <= 10; i++) {
      this.noOfColumnList.push({ title: i, value: i });
    }

    this.examOptions = [
      { label: 'All', value: 'all' },
      { label: 'Addless', value: 'addless' },
      { label: 'Multiplication', value: 'multiplication' },
      { label: 'Division', value: 'division' },
      { label: 'Others', value: 'others' },
    ];

    this.examControls = [
      { label: 'Submit', value: 'submit', styleClass: 'submit-action' },
      { label: 'Next/Skip', value: 'next', styleClass: 'next-action' },
      { label: 'End Exam', value: 'end', styleClass: 'end-action' },
      { label: 'Next Round', value: 'round', styleClass: 'nextRound-action' },
    ];

    this.noOfRowsList = [
      { title: 5, value: 5 },
      { title: 10, value: 10 },
      { title: 15, value: 15 },
      { title: 20, value: 20 },
      { title: 25, value: 25 },
      { title: 30, value: 30 },
      { title: 50, value: 50 },
      { title: 70, value: 70 },
    ];
    this.questionSpeedList = [
      { title: '0.5', value: '0.5' },
      { title: '1.0', value: '1' },
      { title: '1.5', value: '1.5' },
      { title: '2.0', value: '2' },
      { title: '2.5', value: '2.5' },
      { title: '3.0', value: '3' },
      { title: '3.5', value: '3.5' },
    ];
    this.isColumnListLoading = false;
    this.isRowsListLoading = false;
    this.isSpeedListLoading = false;
  }

  handleOnDropdownValueChange(event: any, src: string) {
    const value = event?.value;
    switch (src) {
      case 'level':
        this.isRoundListLoading = true;
        const roundList = this.levelList?.find(
          (item: any) => item.levelId === value
        )?.examRoundList;
        if (roundList?.length) {
          this.roundList = roundList;
          this.isRoundListLoading = false;
        }
        break;
      case 'columns':
        break;
      case 'rows':
        break;
      case 'speed':
        this.selectedSpeedOfQuestion = value;
        break;
    }
    if (this.selectedExamType != '2') {
      this.isFinalExam = true;
    }
  }

  canStartExam(): boolean {
    const data = {
      levelId: this.selectedLevel,
      // roundId: this.selectedRound,
      examTypeId: this.selectedExamType,
      // noOfColumn: this.selectedNoOfColumn,
      // noOfRow: this.selectedNoOfRows
    };
    return Object.values(data).every(
      (value) => value !== null && value !== undefined && value !== ''
    );
  }

  handleExamOptionChange(event: any) {
    const selectedValue = event.value;
  }

  handleExamControlOptionChange(event: any) {
    const target = event?.originalEvent?.target;
    let srcTarget =
      target.innerText === 'Next/Skip'
        ? 'next'
        : target.innerText === 'End Exam'
          ? 'end'
          : target.innerText === 'Next Round'
            ? 'round'
            : target?.innerText.toLowerCase();
    const selectedValue = srcTarget ? srcTarget : event.value;
    this.isSubmitClicked = false;
    this.isNextClicked = false;
    this.isEndClicked = false;
    this.isNextRoundClicked = false;

    switch (selectedValue) {
      case 'submit':
        this.isSubmitClicked = true;
        this.showAnswer = true;
        this.audioService.playSound('simple');
        this.submitQuestion();
        break;
      case 'next':
        this.isNextClicked = true;
        this.resetTimer();
        this.audioService.playSound('next1');
        this.newQuestion();
        break;
      case 'end':
        this.isEndClicked = true;
        this.audioService.playSound('error');
        this.confirm(event?.originalEvent);
        break;
      case 'round':
        this.isNextRoundClicked = true;
        this.audioService.playSound('next1');
        this.nextRound();
        break;
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const mockEvent = { originalEvent: { target: { innerText: 'Submit' } } };
      this.handleExamControlOptionChange(mockEvent);
      event.preventDefault(); // Prevent default form submission or unwanted behavior
    }
  }

  checkAndEndExam() {
    const isLastQuestion = this.activeQuestionIndex === this.questionList.length - 1;
    const isLastRound = this.currentRoundIndex === this.roundIds.length - 1;

    if (isLastQuestion && isLastRound) {
      this.endExam(); // Directly end the exam without confirmation
      return true;
    }
    return false;
  }

  submitQuestion() {
    if (!this.validateNumber(this.selectedAnswer)) {
      this.audioService.playSound('error');
      timer(200).subscribe(() => {
        utils.setMessages('Please Enter the correct answer', 'error');
      });
      return;
    }

    if (this.isAnswerSubmitted) {
      console.log("User Answer", this.selectedAnswer);
      console.log("Correct Answer", this.questionList[this.activeQuestionIndex].answer)
      this.flashQuestionsString = this.questionList[this.activeQuestionIndex].questions.split(',').join(' ');
      this.submitedlashQuestionsIndex = this.activeQuestionIndex;
      this.correctAnswer = this.activeQuestion?.answer;
      const userInput = this.questionList[this.activeQuestionIndex].userInput;
      const isWrongAnswer = String(userInput) !== String(this.correctAnswer);

      this.questionList[this.activeQuestionIndex].isCompleted = true;
      this.questionList[this.activeQuestionIndex].isAttempted = true;
      this.questionList[this.activeQuestionIndex].isSkipped = false;
      this.questionList[this.activeQuestionIndex].isWrongAnswer = isWrongAnswer;
      this.isWrongAnswer = isWrongAnswer;

      // 🔹 Automatically end exam if last question in last round
      if (this.checkAndEndExam()) return;

      if (this.activeQuestionIndex === this.questionList.length - 1) {
        this.canMoveToNextRound = true;
        this.isLoadingQuestion = false;
        this.resetTimer();
      } else {
        this.loadNextQuestion();
      }
    } else {
      this.audioService.playSound('error');
      timer(200).subscribe(() => {
        utils.setMessages('Please Enter the correct answer', 'error');
      });
    }
  }


  validateNumber(input: string): boolean {
    const regex = /^-?\d+$/;
    return regex.test(input);
  }

  nextRound() {
    if (this.canMoveToNextRound) {
      this.isLoadingQuestion = false;
      this.isFlashEnded = false;
      this.selectedAnswer = null;
      this.canMoveToNextRound = false;

      const nextRoundIndex = this.currentRoundIndex + 1;

      // 🔹 Automatically end exam if last round
      if (this.checkAndEndExam()) return;

      if (nextRoundIndex < this.roundIds.length) {
        this.currentRoundIndex = nextRoundIndex;
        this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]);
      } else {
        this.endExam(); // Display results
      }
    } else {
      utils.setMessages('Complete the current round before moving to the next round.', 'info');
    }
  }

  moveToNextRound() {
    const nextRoundIndex = this.currentRoundIndex + 1;

    if (nextRoundIndex < this.roundIds.length) {
      this.currentRoundIndex = nextRoundIndex;
      this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]);
    } else {
      this.endExam();
    }
  }
  newQuestion() {
    this.isFlashEnded = false;
    const isLastQuestion = this.activeQuestionIndex === this.questionList.length - 1;

    this.flashQuestionsString = this.questionList[this.activeQuestionIndex].questions.split(',').join(' ');
    this.correctAnswer = this.activeQuestion?.answer;
    const userInput = this.questionList[this.activeQuestionIndex].userInput;
    const isWrongAnswer = userInput !== this.correctAnswer;
    this.questionList[this.activeQuestionIndex].isAttempted = false;
    this.questionList[this.activeQuestionIndex].isSkipped = true;
    this.questionList[this.activeQuestionIndex].isWrongAnswer = isWrongAnswer;
    this.isWrongAnswer = isWrongAnswer;

    // 🔹 Automatically end exam if last question in last round
    if (this.checkAndEndExam()) return;

    if (isLastQuestion) {
      this.canMoveToNextRound = true;
      this.isLoadingQuestion = false;
      this.isFlashEnded = true;
      this.resetTimer();
      return;
    }

    this.loadNextQuestion();
    this.cdref.detectChanges();
    setTimeout(() => {
      this.focusAnswerInput();
    }, 100);
  }


  focusAnswerInput() {
    if (this.answerInput && this.answerInput.nativeElement) {
      this.renderer.setAttribute(this.answerInput.nativeElement, 'autofocus', 'true');
      this.answerInput.nativeElement.focus();
    }
  }

  loadNextQuestion() {
    const isLastQuestionInRound =
      this.activeQuestionIndex === this.questionList.length - 1;
    if (
      isLastQuestionInRound ||
      this.canMoveToNextRound ||
      this.quizCompleted
    ) {
      return;
    }

    this.resetTimer();
    timer(200)
      .pipe(
        tap(() => {
          if (!this.isAnswerSubmitted || !this.isSubmitClicked) {
            this.flashQuestionsString = this.activeQuestion?.questions
              .split(',')
              .join(' ');
            this.questionList[this.activeQuestionIndex]['isAttempted'] = false;
            this.questionList[this.activeQuestionIndex]['isSkipped'] = true;
          } else {
            this.questionList[this.activeQuestionIndex]['isCompleted'] = true;
            this.questionList[this.activeQuestionIndex]['isAttempted'] = true;
          }

          const nextQuestionIndex = this.activeQuestionIndex + 1;
          this.activeQuestionIndex = nextQuestionIndex;
          this.activeQuestion = this.questionList[nextQuestionIndex];
          this.flashQuestions = this.activeQuestion?.questions.split(',');
          this.flashQuestionsString = this.flashQuestions.join(' ');
          this.isAnswerSubmitted = false;
          this.isFlashEnded = false;
          this.isLoadingQuestion = true;
        }),
        switchMap(() => timer(3000))
      )
      .subscribe(() => {
        this.audioService.playSound('simple');
        this.startFlashing();
      });
  }

  endExam() {
    this.quizCompleted = true; // Prevent any further progression
    this.examStarted = false;
    this.isFlashEnded = true;

    timer(1000)
      .pipe(
        tap(() => {
          this.isSearchDisabled = false;
          this.resetTimer();
        }),
        switchMap(() => timer(500))
      )
      .subscribe(() => {
        this.showExamResults();
      });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'End Exam',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm p-button-danger',
      accept: () => {
        this.endExam();
      },
      reject: () => { },
    });
  }

  handleTimer(event: any) {
    const readableTime = ({
      hours,
      minutes,
      seconds,
    }: {
      hours: any;
      minutes: any;
      seconds: any;
    }) => {
      const hr = parseInt(hours);
      const min = minutes;
      const sec = seconds;
      let timeString = '';
      if (hr > 0) {
        timeString += `${hr} hour${hr > 1 ? 's' : ''}`;
      }
      if (min > 0) {
        if (timeString) timeString += ' ';
        timeString += `${min} minute${min > 1 ? 's' : ''}`;
      }
      if (sec > 0) {
        if (timeString) timeString += ' and ';
        timeString += `${sec} second${sec > 1 ? 's' : ''}`;
      }
      return timeString;
    };
    this.totalElapsedTime = event?.elapsedTime;
    this.timeLeft = readableTime({ ...event });
  }


  handleSearchAction() {
    this.isSearchActionLoading = true;
    this.isSearchDisabled = true;
    const payload = {
      levelId: this.selectedLevel,
      examTypeId: this.selectedExamType,
    };

    this.questionService.getQuestions(parseInt(this.selectedLevel), parseInt(this.selectedExamType)).subscribe({
      next: (response: { [key: string]: any[] }) => {
        if (Object.keys(response).length > 0) {
          this.questionListAll = Object.values(response).flat().sort(
            (a: any, b: any) => parseInt(a.questionId) - parseInt(b.questionId)
          );
          this.groupedQuestions = this.groupQuestionsByRound(this.questionListAll);
          this.roundIds = this.questionService.getRoundIds(this.groupedQuestions);
          this.currentRoundIndex = 0;
          this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]);
          this.isSearchActionLoading = false;
          this.isPanelCollapsed = true;
        } else {
          this.NoDataFound = true;
          this.isSearchActionLoading = false;
          this.isSearchDisabled = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        utils.setMessages(error.message, 'error');
        this.isSearchActionLoading = false;
        this.isSearchDisabled = false;
      },
    });
  }


  groupQuestionsByRound(questions: any[]): { [key: string]: any[] } {
    return questions.reduce((grouped: any, question: any) => {
      const roundId = question.roundId;
      if (!grouped[roundId]) {
        grouped[roundId] = [];
      }
      grouped[roundId].push(question);
      return grouped;
    }, {});
  }


  loadRoundQuestions(roundId: string) {
    this.questionList = this.groupedQuestions[roundId];
    this.activeQuestionIndex = 0;
    this.activeQuestion = this.questionList[this.activeQuestionIndex];
    this.correctAnswer = this.activeQuestion?.answer;
    this.flashQuestions = this.activeQuestion?.questions.split(',');
    this.flashQuestionsString = this.activeQuestion?.questions
      .split(',')
      .join(' ');

    this.isLoadingQuestion = true;
    this.isFlashEnded = false;
    this.examStarted = true;
    this.quizCompleted = false;
    this.showRoundHeader(roundId);
    this.startFlashing();
  }

  showRoundHeader(roundId: string) {
    this.roundHeader = `Round ${roundId}`;
  }

  showExamResults() {
    this.dialogRef = this.dialogService.open(ExamResultComponent, {
      header: 'Exam Results',
      width: '50%',
      data: {
        results: this.questionList, // Pass the questionList data
      },
    });
  }

  resetTimer() {
    this.timerService.resetTimer(); // Assuming timerService has a resetTimer method
  }

  startFlashing(): void {
    const convertToFloat = this.questionList[this.activeQuestionIndex]?.examRoundTime?.split(':').join('.');
    const selectedTime = Math.max(convertToFloat * 1000, 500);
    const adjustedDelay = Math.min(350, selectedTime * 0.8);
    this.currentItem = null;
    this.currentIndex = 0;
    this.state = 'scaled';
    this.checkBoxstate = 'void';
    this.isLoadingQuestion = true;
    interval(selectedTime)
      .pipe(
        take(this.flashQuestions.length),
        switchMap((index) => {
          return of(index).pipe(
            tap(() => {
              this.state = 'void';
              this.cdref.detectChanges();
            }),
            delay(adjustedDelay),
            tap(() => {
              this.isLoadingQuestion = false;
              this.currentIndex = index;
              this.currentItem = this.flashQuestions[index];
              this.state = 'scaled';
              this.cdref.detectChanges();
              this.audioService.playSound('count');
            })
          );
        }),
        finalize(() => {
          timer(selectedTime).subscribe(() => {
            this.finalizeFlashing();
          });
        })
      )
      .subscribe();
  }

  finalizeFlashing(): void {
    this.isFlashEnded = true;
    if (this.activeQuestionIndex >= this.questionList.length) {
      timer(1000)
        .pipe(
          tap(() => {
            this.showAnswer = false;
            this.resetTimer();
            this.quizCompleted = true;
            this.isSearchDisabled = false;
            this.isSearchActionLoading = false;
          }),
          switchMap(() => timer(1500))
        )
        .subscribe(() => {
          this.showExamResults();
        });
    } else {
      timer(1000).subscribe(() => {
        this.state = 'void';
        this.checkBoxstate = 'scaled';
        this.submitedlashQuestionsIndex = -1;
        this.questionTimer = '100';
        this.initQuestionTimer();
        this.options = [];
        //this.populateAndShuffleOptions(); //This function is not defined
        this.cdref.detectChanges();
      });
    }
  }

  initQuestionTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const progressbarValue = this.el.nativeElement.querySelector(
      '.p-progressbar .p-progressbar-value'
    );
    this.showAnswer = false;
    const convertToFloat = this.questionList[this.activeQuestionIndex]?.examRoundTime?.split(':').join('.');
    const totalTime = convertToFloat * 60;
    this.remainingTime = totalTime;
    const warningTime = totalTime * 0.4;
    const criticalTime = totalTime * 0.15;
    const startTime = Date.now();
    timer(1000).subscribe(() => {
      this.subscription = interval(1000)
        .pipe(
          tap(() => {
            const elapsedTime = Date.now() - startTime;
            this.remainingTime = totalTime - Math.floor(elapsedTime / 1000);
            const timeLeft = this.remainingTime;
            const progress = ((this.remainingTime / totalTime)) * 100;
            this.questionTimer = progress.toFixed(2);
            if (timeLeft <= criticalTime) {
              this.isDangerPhase = true;
              this.isWarningPhase = false;
              this.renderer.setStyle(progressbarValue, 'background', '#EF4444');
            } else if (timeLeft <= warningTime) {
              this.isDangerPhase = false;
              this.isWarningPhase = true;
              this.renderer.setStyle(progressbarValue, 'background', '#F59E0B');
            } else {
              this.isDangerPhase = false;
              this.isWarningPhase = false;
              this.renderer.setStyle(progressbarValue, 'background', '#8b5cf6');
            }
            utils.isWarningPhase.set(this.isWarningPhase);
            utils.isDangerPhase.set(this.isDangerPhase);
          }),
          takeWhile(() => this.remainingTime > 0)
        )
        .subscribe({
          complete: () => {
            this.finalizeFlashing();
          },
        });
    });
  }

  getRoundIds(groupedQuestions: { [key: string]: any[] }): string[] {
    return Object.keys(groupedQuestions).sort((a, b) => parseInt(a) - parseInt(b));
  }

  handleKeyValue(event: any) {
    this.selectedAnswer = event;
  }

  OnTimerFinished(event: any) {
    this.finalizeFlashing();
  }

  selectedQuestion(event: any) {
    this.activeQuestionIndex = event;
    this.activeQuestion = this.questionList[this.activeQuestionIndex];
    this.flashQuestions = this.activeQuestion?.questions.split(',');
    this.flashQuestionsString = this.activeQuestion?.questions.split(',').join(' ');
    this.isLoadingQuestion = true;
    this.isFlashEnded = false;
    this.startFlashing();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.audioService.cleanupSounds();
    this.resizeListener();
  }
}
