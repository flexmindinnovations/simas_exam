import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { QuestionItem, QuestionPanelComponent } from '../question-panel/question-panel.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { interval, Subscription, take, tap } from 'rxjs';


@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, QuestionPanelComponent, ProgressBarModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements AfterViewInit {

  @Input({ required: true }) questionDuration: any;

  @Output() timeEnded: EventEmitter<boolean> = new EventEmitter();

  @Input({ required: true }) questionsList: Array<QuestionItem> = [];
  @Input({ required: true }) activeQuestion: any;
  @Input({ required: true }) activeQuestionIndex: any = 0;
  @Input({ required: true }) examStarted: boolean = false;

  @Output() timeLeft: EventEmitter<any> = new EventEmitter();

  @Output() selectedQuestion: EventEmitter<QuestionItem> = new EventEmitter();

  hoursLeft: any = 0;
  minutesLeft: any = 0;
  secondsLeft: any = 0;
  minutesParameter: string = 'Minutes';
  secondsParameter: string = 'Seconds';
  offset: any;
  circumference: any;
  progress: any = 0;
  @ViewChild('progressCircle') progressCircle: any;
  @ViewChild('progressRect') progressRect: any;

  private startTime: any;

  remainingTime: any;
  subscription: Subscription = new Subscription();
  questionTimer: any = 0;


  constructor(
    private cdref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const outerCard: any = document.querySelector('.outerCard');
          if (outerCard) {
            const siblingWidth = outerCard.offsetWidth;
            const progressbar: any = document.getElementById('progressbar');
            progressbar.style.width = siblingWidth + 'px';
            // this.initTimerCounterClock();
            this.initQuestionTimer();
            observer.disconnect();
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  initTimer() {
    const circleRef = this.progressCircle.nativeElement;
    const radius = 45;  // Radius of the circle (in percentage of SVG size)
    const circumference = 2 * Math.PI * radius;
    this.circumference = circumference;
    // const totalTime = 2 * 60 * 1000;  // 5 minutes in milliseconds
    const totalTime = this.questionDuration * 60;  // 5 minutes in milliseconds
    const startTime = Date.now();
    circleRef.style.strokeDasharray = circumference;
    circleRef.style.strokeDashoffset = circumference;


    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.max(0, Math.min(1, elapsedTime / totalTime));
      const offset = this.circumference - (progress * this.circumference);
      const timeLeft = totalTime - elapsedTime;

      circleRef.style.strokeDashoffset = offset;
      this.progress = progress;
      if (progress < 1) {
        this.offset = progress * 100;
        this.hoursLeft = Math.floor(timeLeft / 1000 / 60 / 60);
        this.minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60);
        this.secondsLeft = Math.floor((timeLeft / 1000) % 60);
        this.hoursLeft = this.hoursLeft < 10 ? '0' + this.hoursLeft : this.hoursLeft;
        this.minutesLeft = this.minutesLeft < 10 ? '0' + this.minutesLeft : this.minutesLeft;
        this.secondsLeft = this.secondsLeft < 10 ? '0' + this.secondsLeft : this.secondsLeft;
        requestAnimationFrame(updateProgress);
      }
    }

    updateProgress();
    this.cdref.detectChanges();
  }

  initQuestionTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const progressbarValue = this.el.nativeElement.querySelector('.p-progressbar .p-progressbar-value');
    const totalTime = this.questionDuration;
    this.remainingTime = totalTime;
    const warningTime = totalTime * 0.4;
    const criticalTime = totalTime * 0.15;
    this.questionTimer = totalTime;
    this.startTime = Date.now();
    this.subscription = interval(1000)
      .pipe(
        tap(() => {
          const elapsedTime = Date.now() - this.startTime;
          this.remainingTime = totalTime - Math.floor(elapsedTime / 1000);
          const timeLeft = this.remainingTime;
          const progress = (this.remainingTime / totalTime) * 100;
          this.questionTimer = progress.toFixed(2);
          const remainingTime = timeLeft * 1000;
          this.hoursLeft = Math.floor(remainingTime / 1000 / 60 / 60);
          this.minutesLeft = Math.floor((remainingTime / 1000 / 60) % 60);
          this.secondsLeft = Math.floor((remainingTime / 1000) % 60);
          this.hoursLeft = this.hoursLeft < 10 ? '0' + this.hoursLeft : this.hoursLeft;
          this.minutesLeft = this.minutesLeft < 10 ? '0' + this.minutesLeft : this.minutesLeft;
          this.secondsLeft = this.secondsLeft < 10 ? '0' + this.secondsLeft : this.secondsLeft;

          if (timeLeft <= criticalTime) {
            this.renderer.setStyle(progressbarValue, 'background', '#EF4444');
          } else if (timeLeft <= warningTime) {
            this.renderer.setStyle(progressbarValue, 'background', '#F59E0B');
          } else {
            this.renderer.setStyle(progressbarValue, 'background', '#8b5cf6');
          }
          if (timeLeft == 0) {
            this.subscription.unsubscribe();
            this.handleTimeUp();
            this.timeLeft.emit({ hours: this.hoursLeft, minutes: this.minutesLeft, seconds: this.secondsLeft });
            return;
          } else {
            this.timeLeft.emit({ hours: this.hoursLeft, minutes: this.minutesLeft, seconds: this.secondsLeft, elapsedTime: elapsedTime });
          }
        })
      )
      .subscribe();
  }

  handleTimeUp() {
    this.resetTimer();
    this.timeEnded.emit(true);
  }

  resetTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.remainingTime = this.questionDuration;
    this.questionTimer = 0;
  }

  initTimerCounterClock() {
    const circleRef = this.progressCircle.nativeElement;
    const gradient: any = document.getElementById('dynamicGradient');
    const stops = gradient.children;
    const radius = 45;  // Radius of the circle (in percentage of SVG size)
    const circumference = 2 * Math.PI * radius;
    this.circumference = circumference;
    const totalTime = this.questionDuration * 1000;
    const warningTime = totalTime * 0.4;
    const criticalTime = totalTime * 0.15;
    const startTime = Date.now();
    circleRef.style.strokeDasharray = circumference;
    circleRef.style.strokeDashoffset = circumference;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.max(0, Math.min(1, elapsedTime / totalTime));
      const offset = progress * this.circumference;
      const timeLeft = totalTime - elapsedTime;

      circleRef.style.strokeDashoffset = offset;
      this.progress = progress;

      if (timeLeft <= criticalTime) {
        stops[0].setAttribute('stop-color', '#F87171'); // Red start
        stops[1].setAttribute('stop-color', '#EF4444'); // Red end
      } else if (timeLeft <= warningTime) {
        stops[0].setAttribute('stop-color', '#FBBF24'); // Yellow start
        stops[1].setAttribute('stop-color', '#F59E0B'); // Orange end
      } else {
        stops[0].setAttribute('stop-color', '#8b5cf6'); // Green start
        stops[1].setAttribute('stop-color', '#421d95'); // Blue end
      }

      if (progress < 1) {
        this.offset = progress * 100;
        this.hoursLeft = Math.floor(timeLeft / 1000 / 60 / 60);
        this.minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60);
        this.secondsLeft = Math.floor((timeLeft / 1000) % 60);
        this.hoursLeft = this.hoursLeft < 10 ? '0' + this.hoursLeft : this.hoursLeft;
        this.minutesLeft = this.minutesLeft < 10 ? '0' + this.minutesLeft : this.minutesLeft;
        this.secondsLeft = this.secondsLeft < 10 ? '0' + this.secondsLeft : this.secondsLeft;
        requestAnimationFrame(updateProgress);
      }

      if (timeLeft === 0) {
        this.timeEnded.emit(true);
      }
    }

    updateProgress();
    this.cdref.detectChanges();
  }

  selectedQuestionAction(event: any) {
    this.selectedQuestion.emit(event);
  }
}


