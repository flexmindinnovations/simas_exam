import { Routes } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { LayoutComponent } from "./layout.component";
import { NotFoundComponent } from "../not-found/not-found.component";
import { ExamComponent } from "../exam/exam.component";
import { ExamTypeComponent } from "../exam-type/exam-type.component";
import { ExamReportComponent } from "../exam-report/exam-report.component";
import { FranchiseComponent } from "../franchise/franchise.component";
import { InstructorComponent } from "../instructor/instructor.component";
import { ActivationComponent } from "../activation/activation.component";
import { StudentsComponent } from "../students/students.component";
import { LevelComponent } from "../level/level.component";
import { LessonComponent } from "../lesson/lesson.component";
import { QuestionPaperComponent } from "../question-paper/question-paper.component";
import { QuestionBankComponent } from "../question-bank/question-bank.component";
import { StudentExamComponent } from "../student-exam/student-exam.component";
import { ReportsComponent } from "../reports/reports.component";

export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'exam',
                component: ExamComponent
            },
            {
                path: 'exam-type',
                component: ExamTypeComponent
            },
            {
                path: 'exam-report',
                component: ExamReportComponent
            },
            {
                path: 'franchise',
                component: FranchiseComponent
            },
            {
                path: 'instructor',
                component: InstructorComponent
            },
            {
                path: 'activation',
                component: ActivationComponent
            },
            {
                path: 'students',
                component: StudentsComponent
            },
            {
                path: 'level',
                component: LevelComponent
            },
            {
                path: 'lesson',
                component: LessonComponent
            },
            {
                path: 'question-paper',
                component: QuestionPaperComponent
            },
            {
                path: 'question-bank',
                component: QuestionBankComponent
            },
            {
                path: 'student-exam',
                component: StudentExamComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            },
            {
                path: '**',
                component: NotFoundComponent
            }
        ]
    }
]