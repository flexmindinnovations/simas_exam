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
import { RolesComponent } from "../roles/roles.component";
import { CompetitionComponent } from "../competition/competition.component";
import { HallticketComponent } from "../hallticket/hallticket.component";
import { ExamCenterComponent } from "../exam-center/exam-center.component";
import { BatchAllocationComponent } from "../batch-allocation/batch-allocation.component";
import { ExamActivationComponent } from "../exam-activation/exam-activation.component";

export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                data: { animation: 'HomeComponent' }
            },
            {
                path: 'exam',
                component: ExamComponent,
                data: { animation: 'ExamComponent' }
            },
            {
                path: 'exam-center',
                component: ExamCenterComponent,
                data: { animation: 'ExamCenterComponent' }
            },
            {
                path: 'exam-type',
                component: ExamTypeComponent,
                data: { animation: 'ExamTypeComponent' }
            },
            {
                path: 'exam-report',
                component: ExamReportComponent,
                data: { animation: 'ExamReportComponent' }
            },
            {
                path: 'franchise',
                component: FranchiseComponent,
                data: { animation: 'FranchiseComponent' }
            },
            {
                path: 'instructor',
                component: InstructorComponent,
                data: { animation: 'InstructorComponent' }
            },
            {
                path: 'activation',
                component: ActivationComponent,
                data: { animation: 'ActivationComponent' }
            },
            {
                path: 'students',
                component: StudentsComponent,
                data: { animation: 'StudentsComponent' }
            },
            {
                path: 'level',
                component: LevelComponent,
                data: { animation: 'LevelComponent' }
            },
            {
                path: 'lesson',
                component: LessonComponent,
                data: { animation: 'LessonComponent' }
            },
            {
                path: 'question-paper',
                component: QuestionPaperComponent,
                data: { animation: 'QuestionPaperComponent' }
            },
            {
                path: 'question-bank',
                component: QuestionBankComponent,
                data: { animation: 'QuestionBankComponent' }
            },
            {
                path: 'student-exam',
                component: StudentExamComponent,
                data: { animation: 'StudentExamComponent' }
            },
            {
                path: 'reports',
                component: ReportsComponent,
                data: { animation: 'ReportsComponent' }
            },
            {
                path: 'competition',
                component: CompetitionComponent,
                data: { animation: 'CompetitionComponent' }
            },
            {
                path: 'roles',
                component: RolesComponent,
                data: { animation: 'RolesComponent' }
            },
            {
                path: 'hallticket',
                component: HallticketComponent,
                data: { animation: 'HallticketComponent' }
            },
            {
                path: 'batch-allocation',
                component: BatchAllocationComponent,
                data: { animation: 'BatchAllocationComponent' }
            },
            {
                path: 'exam-activation',
                component: ExamActivationComponent,
                data: { animation: 'ExamActivation' }
            },
            {
                path: '**',
                component: NotFoundComponent,
                data: { animation: 'NotFoundComponent' }
            }
        ]
    }
]