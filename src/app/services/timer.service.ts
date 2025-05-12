import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private timer$: Subject<number> = new Subject<number>();
  private stopTimer$: Subject<void> = new Subject<void>();
  private timeLeft$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalTime: number = 0;

  constructor() {}

  startTimer(totalTime: number): void {
    this.totalTime = totalTime;
    this.timeLeft$.next(totalTime);
    this.stopTimer$ = new Subject<void>(); // Reset stopTimer$
    timer(0, 1000)
      .pipe(takeUntil(this.stopTimer$))
      .subscribe((secondsElapsed) => {
        const timeLeft = this.totalTime - secondsElapsed;
        this.timeLeft$.next(timeLeft);
        this.timer$.next(timeLeft);
        if (timeLeft <= 0) {
          this.stopTimer$.next();
        }
      });
  }

  getTimeLeft$(): Observable<number> {
    return this.timeLeft$.asObservable();
  }

  getTimer$(): Observable<number> {
    return this.timer$.asObservable();
  }

  stopTimer(): void {
    this.stopTimer$.next();
  }

  resetTimer(): void {
    this.stopTimer$.next();
    this.timeLeft$.next(this.totalTime);
  }

  setTimeLeft(timeLeft: number): void {
    this.timeLeft$.next(timeLeft);
  }
}
