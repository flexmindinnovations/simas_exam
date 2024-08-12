import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements AfterViewInit {

  hoursLeft: any = 0;
  minutesLeft: any = 0;
  secondsLeft: any = 0;
  minutesParameter: string = 'Minutes';
  secondsParameter: string = 'Seconds';
  offset: any;
  circumference: any;
  progress: number = 1;

  @ViewChild('progressCircle', { static: false }) progressCircle: any;
  @ViewChild('initialGradient', { static: false }) initialGradient!: ElementRef;
  @ViewChild('warningGradient', { static: false }) warningGradient!: ElementRef;
  @ViewChild('dangerGradient', { static: false }) dangerGradient!: ElementRef;

  constructor(
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initTimer();
  }

  initTimer() {
    const circleRef = this.progressCircle.nativeElement;
    const radius = 45;  // Radius of the circle (in percentage of SVG size)
    const circumference = 2 * Math.PI * radius;
    this.circumference = circumference;
    const totalTime = 2 * 60 * 1000;  // 5 minutes in milliseconds
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


}
