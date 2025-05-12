import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { ExamPaperService } from './exam-paper/exam-paper.service';
import { QuestionBankService } from './question-bank/question-bank.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  constructor(
    private examPaperService: ExamPaperService,
    private questionBankService: QuestionBankService
  ) {}

  getQuestions(
    levelId: number,
    examTypeId: number
  ): Observable<{ [key: string]: any[] }> {
    return this.questionBankService
      .getFlashAnzanQuestionBankListExamTypeAndLevelWise({
        levelId: levelId.toString(),
        examTypeId: examTypeId.toString(),
      })
      .pipe(
        map((questions) => {
          return this.groupQuestionsByRound(questions);
        })
      );
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

  getRoundIds(groupedQuestions: { [key: string]: any[] }): string[] {
    return Object.keys(groupedQuestions).sort((a, b) => parseInt(a) - parseInt(b));
  }
}
