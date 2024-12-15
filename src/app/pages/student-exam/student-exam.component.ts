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
  takeLast,
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

  private sounds: { [key: string]: HTMLAudioElement } = {};

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

  options: any[] = [];
  selectedOptions: Set<number> = new Set();
  selectedAnswer: any;
  flashQuestionsString: any;
  modifiedFlashQuestionsString: any;
  submitedlashQuestionsIndex: number = 0;

  questionInterval: any;

  dialogRef: DynamicDialogRef | undefined;

  totalTime: number = 30; // 3 minutes in seconds
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
  roundIds: any[] = [];
  questionListAll: any[] = [];
  groupedQuestions: any;
  currentRoundIndex = 0;
  roundHeader: string = '';
  canMoveToNextRound = false;
  isFocused: boolean = false;

  @ViewChild('exampOptionsCard') exampOptionsCard!: ElementRef;
  @ViewChild('answerInput', { static: false }) answerInput!: ElementRef;

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
        this.cleanupSounds();
      });

    this.initSound();
    this.getMasterData();
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      if (!this.isMobile) {
        window.location.reload();
      }
    });
  }

  get filteredExamControls() {
    return this.examControls.filter(
      (control) => control.value !== 'round' || this.canMoveToNextRound
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

  initSound() {
    this.sounds['submit'] = this.createAudioElement('/audio/next.mp3');
    this.sounds['next'] = this.createAudioElement('/audio/next.mp3');
    this.sounds['end'] = this.createAudioElement('/audio/next.mp3');
    this.sounds['count'] = this.createAudioElement('/audio/count.mp3');
    this.sounds['simple'] = this.createAudioElement('/audio/simple.mp3');
    this.sounds['next1'] = this.createAudioElement('/audio/next1.mp3');
    this.sounds['error'] = this.createAudioElement('/audio/error.mp3');

    Object.keys(this.sounds).forEach((key) => {
      this.sounds[key].preload = 'auto';
      this.sounds[key].load();
    });
  }

  createAudioElement(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
  }

  getMasterData() {
    this.isExamTypeListLoading = true;
    this.isLevelListLoading = true;
    this.isColumnListLoading = true;
    this.isRowsListLoading = true;
    this.isSpeedListLoading = true;
    const examList = this.examTypeService.getExamTypeList();
    const levelList = this.levelService.getLevelList();
    forkJoin({ examList, levelList }).subscribe({
      next: (response) => {
        if (response) {
          const { examList, levelList } = response;
          this.levelList = levelList;
          this.examTypeList = examList;
          if (examList.length) this.isExamTypeListLoading = false;
          if (levelList.length) this.isLevelListLoading = false;
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
    let sound = this.sounds[selectedValue];
    this.isSubmitClicked = false;
    this.isNextClicked = false;
    this.isEndClicked = false;
    this.isNextRoundClicked = false;

    switch (selectedValue) {
      case 'submit':
        this.isSubmitClicked = true;
        this.showAnswer = true;
        sound = this.sounds['simple'];
        this.submitQuestion();
        break;
      case 'next':
        this.isNextClicked = true;
        sound = this.sounds['next1'];
        this.playSound(sound);
        this.newQuestion();
        break;
      case 'end':
        this.isEndClicked = true;
        sound = this.sounds['error'];
        this.playSound(sound);
        this.confirm(event?.originalEvent);
        break;
      case 'round':
        this.isNextRoundClicked = true;
        sound = this.sounds['next1'];
        this.playSound(sound);
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

  submitQuestion() {
    if (!this.validateNumber(this.selectedAnswer)) {
      const sound = this.sounds['error'];
      this.playSound(sound);
      timer(200).subscribe(() => {
        utils.setMessages('Please Enter the correct answer', 'error');
      });
      return; // Exit the function early if validation fails
    }

    if (this.isAnswerSubmitted) {
      const isLastQuestionInRound =
        this.activeQuestionIndex === this.questionList.length - 1;

      // Process the current question
      this.flashQuestionsString = this.questionList[
        this.activeQuestionIndex
      ].questions
        .split(',')
        .join(' ');
      this.formatSequence();
      this.submitedlashQuestionsIndex = this.activeQuestionIndex;
      this.correctAnswer = this.activeQuestion?.answer;
      const userInput = this.questionList[this.activeQuestionIndex].userInput;
      const isWrongAnswer = String(userInput) !== String(this.correctAnswer);

      // Mark question status
      this.questionList[this.activeQuestionIndex]['isCompleted'] = true;
      this.questionList[this.activeQuestionIndex].isAttempted = true;
      this.questionList[this.activeQuestionIndex].isSkipped = false;
      this.questionList[this.activeQuestionIndex].isWrongAnswer = isWrongAnswer;
      this.isWrongAnswer = isWrongAnswer;

      if (isLastQuestionInRound) {
        this.canMoveToNextRound = true;
        this.isLoadingQuestion = false;
        this.resetTimer();
      } else {
        this.loadNextQuestion();
      }
    } else {
      const sound = this.sounds['error'];
      this.playSound(sound);
      timer(200).subscribe(() => {
        utils.setMessages('Please Enter the correct answer', 'error');
      });
    }

  }

  validateNumber(input: string): boolean {
    const regex = /^-?\d+(\.\d+)?$/;
    return regex.test(input);
  }

  nextRound() {
    if (this.canMoveToNextRound) {
      this.isLoadingQuestion = false; // Clear loading state
      this.isFlashEnded = false; // Reset flash state
      this.selectedAnswer = null;
      this.canMoveToNextRound = false;

      const nextRoundIndex = this.currentRoundIndex + 1;
      if (nextRoundIndex < this.roundIds.length) {
        this.currentRoundIndex = nextRoundIndex;
        this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]);
      } else {
        this.endExam();
      }
    } else {
      utils.setMessages(
        'Complete the current round before moving to the next round.',
        'info'
      );
    }
  }

  moveToNextRound() {
    const nextRoundIndex = this.currentRoundIndex + 1;

    if (nextRoundIndex < this.roundIds.length) {
      // Load the next round's questions
      this.currentRoundIndex = nextRoundIndex;
      this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]); // Load the next round
    } else {
      // All rounds are completed, end the exam
      this.endExam();
    }
  }
  newQuestion() {
    const isLastQuestionInRound = this.activeQuestionIndex === this.questionList.length - 1;

    this.flashQuestionsString = this.questionList[this.activeQuestionIndex].questions.split(',').join(' ');
    this.correctAnswer = this.activeQuestion?.answer;
    const userInput = this.questionList[this.activeQuestionIndex].userInput;
    const isWrongAnswer = userInput !== this.correctAnswer;
    this.questionList[this.activeQuestionIndex].isAttempted = false;
    this.questionList[this.activeQuestionIndex].isSkipped = true;
    this.questionList[this.activeQuestionIndex].isWrongAnswer = isWrongAnswer;
    this.isWrongAnswer = isWrongAnswer;

    if (isLastQuestionInRound) {
      this.canMoveToNextRound = true;
      this.isLoadingQuestion = false;
      this.resetTimer();
      return;
    }

    this.loadNextQuestion();
    this.cdref.detectChanges(); // Ensure view updates before focusing
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
    // Check if the round has ended
    const isLastQuestionInRound =
      this.activeQuestionIndex === this.questionList.length - 1;
    if (
      isLastQuestionInRound ||
      this.canMoveToNextRound ||
      this.quizCompleted
    ) {
      return; // Prevent loading new questions if the round is completed
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
          this.isAnswerSubmitted = false;
          this.isFlashEnded = false;
          this.isLoadingQuestion = true;
        }),
        switchMap(() => timer(1000))
      )
      .subscribe(() => {
        const sound = this.sounds['simple'];
        this.playSound(sound);
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

  playSound(sound: HTMLAudioElement) {
    sound.volume = utils.audioVolume;
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }
  handleSearchAction() {
    this.isSearchActionLoading = true;
    this.isSearchDisabled = true;
    const payload = {
      levelId: this.selectedLevel,
      examTypeId: this.selectedExamType,
    };

    this.questionBankService
      .getFlashAnzanQuestionBankListExamTypeAndLevelWise(payload)
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            // Group questions by roundId
            this.questionListAll = response?.sort(
              (a: any, b: any) => parseInt(a) - parseInt(b)
            );
            this.groupedQuestions = this.groupQuestionsByRound(response);
            this.roundIds = Object.keys(this.groupedQuestions).sort(
              (a, b) => parseInt(a) - parseInt(b)
            ); // Sort rounds
            this.currentRoundIndex = 0; // Start from the first round

            this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]); // Load the first round's questions
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

  // Helper function to group questions by round
  groupQuestionsByRound(questions: any[]) {
    return questions.reduce((grouped: any, question: any) => {
      const roundId = question.roundId;
      if (!grouped[roundId]) {
        grouped[roundId] = [];
      }
      grouped[roundId].push(question);
      return grouped;
    }, {});
  }

  // Function to load the questions for a specific round
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
    this.showRoundHeader(roundId); // Optionally display round header
    this.startFlashing();
  }

  // Optionally, display the current round
  showRoundHeader(roundId: string) {
    this.roundHeader = `Round ${roundId}`;
  }

  startFlashing(): void {
    const selectedTime = parseFloat(this.selectedSpeedOfQuestion) * 1000;
    this.currentItem = null;
    this.currentIndex = 0;
    this.state = 'scaled';
    this.checkBoxstate = 'void';
    this.isLoadingQuestion = true;
    interval(selectedTime)
      .pipe(
        take(this.flashQuestions.length),
        concatMap((index) => {
          return of(index).pipe(
            tap(() => {
              this.state = 'void';
              this.cdref.detectChanges();
            }),
            delay(350),
            tap(() => {
              this.isLoadingQuestion = false;
              this.currentIndex = index;
              this.currentItem = this.flashQuestions[index];
              this.state = 'scaled';
              this.cdref.detectChanges();
              this.playSound(this.sounds['count']);
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
    // this.isLoadingQuestion = false; // Ensure loading state is off

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
      // Prepare for the next question
      timer(1000).subscribe(() => {
        this.state = 'void';
        this.checkBoxstate = 'scaled';
        this.submitedlashQuestionsIndex = -1;
        this.questionTimer = '100';
        this.initQuestionTimer();
        this.options = [];
        this.populateAndShuffleOptions();
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
    const totalTime = this.totalTime;
    this.remainingTime = totalTime;
    const warningTime = totalTime * 0.4;
    const criticalTime = totalTime * 0.15;
    const startTime = Date.now();
    timer(1000).subscribe(() => {
      this.subscription = interval(1000)
        .pipe(
          tap(() => {
            const elapsedTime = Date.now() - startTime;
            // this.elapsedTime = elapsedTime;
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
            if (timeLeft == 0) {
              this.subscription.unsubscribe();
              this.renderer.setStyle(progressbarValue, 'background', '#8b5cf6');
              this.handleTimeUp();
              return;
            }
            // this.questionList[this.activeQuestionIndex]['timeTaken'] =
            //   elapsedTime.toString();
          })
        )
        .subscribe();
    });
  }

  handleTimeUp() {
    this.isDangerPhase = false;
    this.isWarningPhase = false;
    this.questionTimer = '0';
    timer(2000).subscribe(() => {
      this.resetTimer();
      if (!this.isAnswerSubmitted || !this.isSubmitClicked) {
        this.questionList[this.activeQuestionIndex].isSkipped = true;
        this.questionList[this.activeQuestionIndex].isAttempted = false;
        this.questionList[this.activeQuestionIndex].isWrongAnswer = true;
      }
      this.isFlashEnded = false;
      this.showAnswer = false; // Mark flash as ended
      this.newQuestion();
    });
  }

  resetTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.selectedAnswer = null;
    this.remainingTime = this.totalTime;
    // this.isLoadingQuestion = false; // Ensure this resets
    this.isWrongAnswer = false;
    this.isWarningPhase = false;
    this.isDangerPhase = false;
    this.flashQuestionsString = '';
    this.questionTimer = '0';
    this.checkBoxstate = 'void';
    utils.isWarningPhase.set(this.isWarningPhase);
    utils.isDangerPhase.set(this.isDangerPhase);
    this.cdref.detectChanges(); // Ensure DOM is updated
    setTimeout(() => {
      this.focusAnswerInput();
    }, 100);

  }

  ngAfterViewChecked() {
    if (!this.selectedAnswer) {
      // Focus only when no answer is selected
      setTimeout(() => {
        this.focusAnswerInput();
      }, 100);
    }
  }

  OnTimerFinished(timeFinished: boolean) {
    if (timeFinished) {
      timer(1000)
        .pipe(
          tap(() => {
            this.resetTimer();
            this.isFlashEnded = false;
            this.showAnswer = false;
            this.checkBoxstate = 'void';
            this.quizCompleted = true;
          }),
          switchMap(() => timer(500))
        )
        .subscribe(() => {
          this.showExamResults();
        });
    }
  }

  populateAndShuffleOptions(): void {
    const correctAnswer = this.calculateAnswer();
    this.options = [+correctAnswer];
    const isNumberExists = (number: number) => {
      return this.options.indexOf(number) !== -1;
    };

    while (this.options.length < 5) {
      let randomNumber: number;
      do {
        randomNumber = Math.floor(Math.random() * 10) + 1;
      } while (isNumberExists(randomNumber));
      this.options.push(randomNumber);
    }
    this.options = this.shuffleArray(this.options);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onCheckboxChange(event: any): void {
    const input = event;
    if (input) {
      this.questionList[this.activeQuestionIndex]['userInput'] =
        input.toString();
      this.isAnswerSubmitted = true;
      this.isSubmitClicked = false;
      this.isNextClicked = false;
      this.isEndClicked = false;
      this.isNextRoundClicked = false;
    }
  }

  handleKeyValue(event: any): void {
    const input = event;
    this.selectedAnswer = input;
    // console.log({ input, selectedAnswer: this.selectedAnswer });
    if (input) {
      this.questionList[this.activeQuestionIndex]['userInput'] = input;
      this.isAnswerSubmitted = true;
      this.isSubmitClicked = false;
      this.isNextClicked = false;
      this.isEndClicked = false;
      this.isNextRoundClicked = false;
    }
  }

  selectedQuestion(question: QuestionItem) {
    this.resetTimer();
    if (!this.isAnswerSubmitted || !this.isSubmitClicked) {
      this.questionList[this.activeQuestionIndex].isSkipped = true;
      this.isWrongAnswer = true;
    }
    this.activeQuestion = question;
    this.correctAnswer = this.activeQuestion?.answer;
    this.activeQuestionIndex = this.activeQuestion?.questionIndex;
    this.questionType = this.activeQuestion?.questionType;
    this.flashQuestions = this.activeQuestion?.questions.split(',');
    this.flashQuestionsString = this.activeQuestion?.questions
      .split(',')
      .join(' ');
    this.isAnswerSubmitted = false;
    this.isFlashEnded = false;
    this.showAnswer = false;
    this.checkBoxstate = 'void';
    const sound = this.sounds['submit'];
    timer(1500).subscribe(() => {
      this.playSound(sound);
      this.startFlashing();
    });
  }

  formatSequence() {
    const elements = this.flashQuestionsString.split(' ');
    let modifiedSequence = [];
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.includes('-')) {
        element = element.replace('-', '- ');
      }
      if (!element.includes('-') && i !== 0) {
        modifiedSequence.push('+');
      }
      modifiedSequence.push(element);
    }
    this.modifiedFlashQuestionsString = modifiedSequence.join(' ');
  }

  calculateAnswer() {
    const sequence: any = this.flashQuestions ?? 0;
    let result: any = 0;
    if (sequence?.length) {
      result = sequence.reduce((acc: any, cur: any) => +acc + +cur, 0);
    }
    return result;
  }

  showExamResults() {
    const allResults: any = [];

    for (const roundId of this.roundIds) {
      const questionsInRound = this.groupedQuestions[roundId];

      const roundResults = questionsInRound.map((question: any) => {
        return {
          userInput: question.userInput,
          isSkipped: question.isSkipped || false,
          isAttempted: question.isAttempted || false,
        };
      });
      allResults.push(...roundResults);
    }

    const questionAllResult = this.questionListAll.map((item, index) => {
      const question = allResults[index] || {}; // Match allResults by index

      return {
        questionBankId: item.questionBankId,
        levelId: item.levelId,
        roundId: item.roundId,
        roundName: item.roundName,
        levelName: item.levelName,
        questionType: item.questionType,
        examTypeId: item.examTypeId,
        examTypeName: item.examTypeName,
        questionBankDetailsId: item.questionBankDetailsId,
        noOfColumn: item.noOfColumn,
        noOfRow: item.noOfRow,
        questions: item.questions,
        answer: item.answer,
        examRoundTime: item.examRoundTime,
        isActive: item.isActive,
        timeTaken: item.timeTaken,
        userAnswer: question.userInput,
        isCorrect: String(question.userInput) === String(item.answer),
        isWrongAnswer: String(question.userInput) !== String(item.answer),
        isSkipped: question.isSkipped,
        isAttempted: question.isAttempted,
        question, // Adding question object from allResults
      };
    });

    const examInputData = {
      examPaperId: 0,
      studentId: 0,
      levelId: this.selectedLevel,
      roundId: 0,
      questionId: 0,
      examTypeId: this.selectedExamType,
      examPaperDate: new Date().toISOString(),
      examPaperTime: this.totalTime,
    };

    this.dialogRef = this.dialogService.open(ExamResultComponent, {
      data: {
        questionList: questionAllResult,
        examInputData,
        totalTime: this.totalTime,
      },
      closable: true,
      modal: true,
      height: 'auto',
      width: utils.isMobile() ? '95%' : '42%',
      styleClass: 'add-edit-dialog',
      header: 'Exam Result',
    });

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        this.isPanelCollapsed = !this.isPanelCollapsed;
        utils.setMessages(res.message, 'success');
      }
    });
  }

  cleanupSounds(): void {
    Object.keys(this.sounds).forEach((key) => {
      if (this.sounds[key]) {
        this.sounds[key].currentTime = 0;
        this.sounds[key].pause();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
    this.cleanupSounds();
    this.resetTimer();
  }

  loadNextRound() {
    this.selectedAnswer = null;
    const nextRoundIndex = this.currentRoundIndex + 1;

    if (nextRoundIndex < this.roundIds.length) {
      // Move to the next round
      this.currentRoundIndex = nextRoundIndex;
      this.loadRoundQuestions(this.roundIds[this.currentRoundIndex]); // Load the next round's questions
    } else {
      // End the quiz if no more rounds
      this.quizCompleted = true;
      this.showExamResults();
    }
  }
}
