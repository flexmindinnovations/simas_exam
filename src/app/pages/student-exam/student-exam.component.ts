import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, effect, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TimerComponent } from '../../components/timer/timer.component';
import { QuestionItem, QuestionPanelComponent } from '../../components/question-panel/question-panel.component';
import { ExamPaperService } from '../../services/exam-paper/exam-paper.service';
import { ExamTypeService } from '../../services/exam-type/exam-type.service';
import { LevelService } from '../../services/level/level.service';
import { concatMap, delay, forkJoin, from, interval, last, map, of, Subscription, take, takeLast, tap, timer } from 'rxjs';
import { utils } from '../../utils';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TooltipModule, DropdownModule, TimerComponent, QuestionPanelComponent, SelectButtonModule, RadioButtonModule, ProgressBarModule],
  providers: [DialogService],
  templateUrl: './student-exam.component.html',
  styleUrl: './student-exam.component.scss',
  animations: [
    trigger('scaleUp', [
      state('void', style({ opacity: '0', transform: 'scale(0)' })),
      state('scaled', style({ opacity: '1', transform: 'scale(1)' })),
      transition('void => scaled', animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
      transition('scaled => void', animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ]),
    trigger('scaleUpQuestion', [
      state('void', style({ opacity: '0', transform: 'translateX(-150px)' })),
      state('scaled', style({ opacity: '1', transform: 'translateX(0)' })),
      transition('void => scaled', animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
      transition('scaled => void', animate('100ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
  ]
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
  isFlashEnded: boolean = false;
  isLoadingQuestion: boolean = false;
  quizCompleted: boolean = false;
  options: any[] = [];
  selectedOptions: Set<number> = new Set();
  selectedAnswer: any;

  questionInterval: any;

  totalTime: number = 1 * 60; // 3 minutes in seconds
  questionTimer: any = '0';
  remainingTime: number = this.totalTime;
  subscription: Subscription = new Subscription();

  isWarningPhase: boolean = false;
  isDangerPhase: boolean = false;

  isSidebarOpened: boolean = false;
  resizeObserver: any;
  resizeListener: any;

  @ViewChild('exampOptionsCard') exampOptionsCard!: ElementRef;
  constructor(
    private examTypeService: ExamTypeService,
    private levelService: LevelService,
    private el: ElementRef,
    private questionBankService: QuestionBankService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
    private host: ElementRef
  ) {
    effect(() => {
      this.isSidebarOpened = utils.sideBarOpened();
    })
  }

  ngOnInit(): void {
    this.initSound();
    this.getMasterData();
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      window.location.reload();
    })
  }

  ngAfterViewInit(): void {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const exampOptionsCard: any = document.querySelector('.exampOptionsCard');
          if (exampOptionsCard) {
            const siblingWidth = exampOptionsCard.offsetWidth;
            const questionCard: any = document.getElementById('questionCard');
            questionCard.style.width = siblingWidth - 2 + 'px';
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

    Object.keys(this.sounds).forEach(key => {
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
      }
    });

    for (let i = 1; i <= 10; i++) {
      this.noOfColumnList.push({ title: i, value: i });
    }

    this.examOptions = [
      { label: 'All', value: 'all' },
      { label: 'Addless', value: 'addless' },
      { label: 'Multiplication', value: 'multiplication' },
      { label: 'Division', value: 'division' },
      { label: 'Others', value: 'others' }
    ]

    this.examControls = [
      { label: 'Submit', value: 'submit', styleClass: 'submit-action' },
      { label: 'Next/Skip', value: 'next', styleClass: 'next-action' },
      { label: 'End Exam', value: 'end', styleClass: 'end-action' },
    ]

    this.noOfRowsList = [
      { title: 5, value: 5 },
      { title: 10, value: 10 },
      { title: 15, value: 15 },
      { title: 20, value: 20 },
      { title: 25, value: 25 },
      { title: 30, value: 30 },
      { title: 50, value: 50 },
      { title: 70, value: 70 }
    ];
    this.questionSpeedList = [
      { title: '0.5', value: '0.5' },
      { title: '1.0', value: '1' },
      { title: '1.5', value: '1.5' },
      { title: '2.0', value: '2' },
      { title: '2.5', value: '2.5' },
      { title: '3.0', value: '3' },
      { title: '3.5', value: '3.5' }
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
        const roundList = this.levelList?.find((item: any) => item.levelId === value)?.examRoundList;
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
      roundId: this.selectedRound,
      examTypeId: this.selectedExamType,
      noOfColumn: this.selectedNoOfColumn,
      noOfRow: this.selectedNoOfRows
    }
    return Object.values(data).every(value => value !== null && value !== undefined && value !== '');
  }

  handleExamOptionChange(event: any) {
    const selectedValue = event.value;

  }

  handleExamControlOptionChange(event: any) {
    const target = event?.originalEvent?.target;
    let srcTarget = target.innerText === 'Next/Skip' ? 'next' : target.innerText === 'End Exam' ? 'end' : target?.innerText.toLowerCase();
    const selectedValue = srcTarget ? srcTarget : event.value;
    let sound = this.sounds[selectedValue];
    switch (selectedValue) {
      case 'submit':
        sound = this.sounds['simple'];
        this.submitQuestion()
        break;
      case 'next':
        sound = this.sounds['next1'];
        this.playSound(sound);
        this.newQuestion();
        break;
      case 'end':
        sound = this.sounds['error'];
        this.playSound(sound);
        break;
    }
  }

  submitQuestion() {
    if (this.isAnswerSubmitted) {
      if (this.activeQuestionIndex === this.questionList?.length - 1) {
        utils.setMessages('Questions finished', 'error');
      } else {
        this.resetTimer();
        setTimeout(() => {
          this.questionList[this.activeQuestionIndex]['isCompleted'] = true;
          const nextQuestionIndex = this.activeQuestionIndex + 1;
          const activeQuestion = this.questionList[nextQuestionIndex];
          this.activeQuestionIndex = nextQuestionIndex;
          this.activeQuestion = activeQuestion;
          this.flashQuestions = this.activeQuestion?.questions.split(',');
          this.correctAnswer = this.activeQuestion?.answer;
          const userInput = this.questionList[this.activeQuestionIndex].userInput;
          const isWrongAnswer = userInput != this.correctAnswer ? true : false;
          this.questionList[this.activeQuestionIndex].isAttempted = true;
          this.questionList[this.activeQuestionIndex].isWrongAnswer = isWrongAnswer;
          this.isAnswerSubmitted = false;
          const sound = this.sounds['simple'];
          this.isFlashEnded = false;
          setTimeout(() => {
            this.isLoadingQuestion = true;
            this.playSound(sound);
            this.startFlashing();
          }, 1000);
        }, 200);

      }
    } else {
      const sound = this.sounds['error'];
      this.playSound(sound);
      setTimeout(() => {
        utils.setMessages('Please choose the correct answer', 'error');
      }, 200)
    }
  }

  newQuestion() {
    if (this.activeQuestionIndex === this.questionList.length - 1) {
      this.questionList[this.activeQuestionIndex].isSkipped = true;
      utils.setMessages('Questions finished', 'error');
    } else {
      this.questionList[this.activeQuestionIndex].isSkipped = true;
      setTimeout(() => {
        const nextQuestionIndex = this.activeQuestionIndex + 1;
        const activeQuestion = this.questionList[nextQuestionIndex];
        this.activeQuestionIndex = nextQuestionIndex;
        this.activeQuestion = activeQuestion;
        this.flashQuestions = this.activeQuestion?.questions.split(',');
        this.correctAnswer = this.activeQuestion?.answer;
        this.isAnswerSubmitted = false;
        const sound = this.sounds['simple'];
        this.isFlashEnded = false;
        setTimeout(() => {
          this.isLoadingQuestion = true;
          this.playSound(sound);
          this.startFlashing();
        }, 1000);
      }, 200);
      this.cdref.detectChanges();
    }
  }

  playSound(sound: HTMLAudioElement) {
    sound.volume = utils.audioVolume;
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }

  handleSearchAction() {
    this.isSearchActionLoading = true;
    this.isSearchDisabled = true;
    const payload = {
      levelId: this.selectedLevel,
      roundId: this.selectedRound,
      examTypeId: this.selectedExamType,
      noOfColumn: this.selectedNoOfColumn,
      noOfRow: this.selectedNoOfRows
    }
    this.questionBankService.flashAnzanQuestionBankListExamTypeAndLevelAndRoundWise(payload)
      .subscribe({
        next: (response) => {
          if (response) {
            this.questionList = response.map((item: any) => {
              item['isAttempted'] = false;
              item['isWrongAnswer'] = false;
              return item;
            });
            this.activeQuestion = this.questionList[0];
            this.correctAnswer = this.activeQuestion?.answer;
            this.questionType = this.activeQuestion?.questionType;
            this.flashQuestions = this.activeQuestion?.questions.split(',');
            this.activeQuestionIndex = 0;
            this.isLoadingQuestion = true;
            const sound = this.sounds['simple'];
            this.playSound(sound);
            setTimeout(() => {
              this.startFlashing();
            }, 500);
            this.examStarted = true;
            this.isSearchActionLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          utils.setMessages(error.message, 'error');
          this.isSearchActionLoading = false;
          this.isSearchDisabled = false;
        }
      })
  }

  startFlashing(): void {
    const selectedTime = (parseFloat(this.selectedSpeedOfQuestion) * 1000);
    this.currentItem = null;
    this.currentIndex = 0;
    this.state = 'scaled';
    this.checkBoxstate = 'void';
    interval(selectedTime)
      .pipe(
        take(this.flashQuestions.length),
        tap(index => {
          this.isLoadingQuestion = false;
          this.currentIndex = index;
          this.currentItem = this.flashQuestions[index];
          this.state = 'scaled';
          this.cdref.detectChanges();
          this.playSound(this.sounds['count']);
        }),
        concatMap(() => of(null).pipe(delay(500))),
        tap(() => {
          this.state = 'void';
          this.cdref.detectChanges();
        })
      )
      .subscribe({
        complete: () => {
          this.currentItem = null;
          setTimeout(() => {
            this.isFlashEnded = true;
            this.checkBoxstate = 'scaled';
          }, 1000);
          this.questionTimer = '100';
          this.initQuestionTimer();
          this.options = [];
          this.options.push(Number(this.correctAnswer));
          const isNumberExists: any = (number: number) => {
            return this.options.indexOf(number) !== -1;
          }
          while (this.options.length < 5) {
            let randomNumber: number;
            do {
              randomNumber = Math.floor(Math.random() * 10) + 1;
            } while (isNumberExists(randomNumber));
            this.options.push(randomNumber);
          }
          const shuffleArray = (array: any[]) => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          };
          this.options = shuffleArray(this.options);
          this.cdref.detectChanges();
          if (this.activeQuestionIndex === this.questionList.length - 1) {
            setTimeout(() => this.quizCompleted = true, 1500);
          }
        }
      });
  }

  initQuestionTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const progressbarValue = this.el.nativeElement.querySelector('.p-progressbar .p-progressbar-value');
    const totalTime = this.totalTime;
    this.remainingTime = totalTime;
    const warningTime = totalTime * 0.4;
    const criticalTime = totalTime * 0.15;
    const startTime = Date.now();
    setTimeout(() => {
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
            if (timeLeft == 0) {
              this.subscription.unsubscribe();
              this.renderer.setStyle(progressbarValue, 'background', '#8b5cf6');
              this.handleTimeUp();
              return;
            }
          })
        )
        .subscribe();
    }, 1000);
  }

  handleTimeUp() {
    this.isLoadingQuestion = true;
    this.isDangerPhase = false;
    this.isWarningPhase = false;
    this.questionTimer = '0';
    setTimeout(() => {
      this.resetTimer();
      if (!this.isAnswerSubmitted) {
        this.questionList[this.activeQuestionIndex].isSkipped = true;
        this.questionList[this.activeQuestionIndex].isAttempted = false;
        this.questionList[this.activeQuestionIndex].isWrongAnswer = true;
      }
      this.isFlashEnded = false;
      this.newQuestion();
    }, 2000);
  }

  resetTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.selectedAnswer = null;
    this.remainingTime = this.totalTime;
    this.questionTimer = '0';
    this.checkBoxstate = 'void';
  }

  OnTimerFinished(timeFinished: boolean) {
    if (timeFinished) {
      this.isFlashEnded = false;
      this.checkBoxstate = 'void';
      this.quizCompleted = true;
    }
  }

  onCheckboxChange(event: any): void {
    const input = event;
    if (input) {
      this.questionList[this.activeQuestionIndex]['userInput'] = input;
      this.isAnswerSubmitted = true;
    }
  }

  selectedQuestion(question: QuestionItem) {
    this.resetTimer();
    if (!this.isAnswerSubmitted) {
      this.questionList[this.activeQuestionIndex].isSkipped = true;
    }
    this.activeQuestion = question;
    this.correctAnswer = this.activeQuestion?.answer;
    this.activeQuestionIndex = this.activeQuestion?.questionIndex;
    this.questionType = this.activeQuestion?.questionType;
    this.flashQuestions = this.activeQuestion?.questions.split(',');
    this.isAnswerSubmitted = false;
    this.isFlashEnded = false;
    this.checkBoxstate = 'void';
    const sound = this.sounds['submit'];
    setTimeout(() => {
      this.playSound(sound);
      this.startFlashing();
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

}

