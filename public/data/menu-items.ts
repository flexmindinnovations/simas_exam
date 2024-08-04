import { MenuItem } from "../../src/app/interfaces/menu-item";

export const MENU_ITEMS: Array<MenuItem> = [
    {
        id: 1,
        title: 'Dashboard',
        moduleName: 'Dashboard',
        icon: 'pi pi-th-large',
        isActive: false,
        route: 'home'
    },
    // {
    //     id: 2,
    //     title: 'Exam',
    //     moduleName: 'Exam',
    //     icon: 'pi pi-pencil',
    //     isActive: false,
    //     route: 'exam'
    // },
    {
        id: 3,
        title: 'Exam Type',
        moduleName: 'ExamType',
        icon: 'pi pi-list',
        isActive: false,
        route: 'exam-type'
    },
    {
        id: 4,
        title: 'Exam Report',
        moduleName: 'ExamReport',
        icon: 'pi pi-chart-line',
        isActive: false,
        route: 'exam-report'
    },
    {
        id: 5,
        title: 'Franchise',
        moduleName: 'Franchise',
        icon: 'pi pi-briefcase',
        isActive: false,
        route: 'franchise'
    },
    {
        id: 6,
        title: 'Instructor',
        moduleName: 'Instructor',
        icon: 'pi pi-user',
        isActive: false,
        route: 'instructor'
    },
    {
        id: 7,
        title: 'Activation',
        moduleName: 'Activation',
        icon: 'pi pi-key',
        isActive: false,
        route: 'activation'
    },
    {
        id: 8,
        title: 'Students',
        moduleName: 'Students',
        icon: 'pi pi-users',
        isActive: false,
        route: 'students'
    },
    {
        id: 9,
        title: 'Level',
        moduleName: 'Level',
        icon: 'pi pi-sitemap',
        isActive: false,
        route: 'level'
    },
    {
        id: 10,
        title: 'Lesson',
        moduleName: 'Lesson',
        icon: 'pi pi-book',
        isActive: false,
        route: 'lesson'
    },
    {
        id: 11,
        title: 'Question Paper',
        moduleName: 'QuestionPaper',
        icon: 'pi pi-file',
        isActive: false,
        route: 'question-paper'
    },
    {
        id: 12,
        title: 'Question Bank',
        moduleName: 'QuestionBank',
        icon: 'pi pi-database',
        isActive: false,
        route: 'question-bank'
    },
    {
        id: 13,
        title: 'Student Exam',
        moduleName: 'StudentExam',
        icon: 'pi pi-file-edit',
        isActive: false,
        route: 'student-exam'
    },
    {
        id: 14,
        title: 'Reports',
        moduleName: 'Reports',
        icon: 'pi pi-chart-bar',
        isActive: false,
        route: 'reports'
    },
    {
        id: 15,
        title: 'Competition',
        moduleName: 'Competition',
        icon: 'pi pi-trophy',
        isActive: false,
        route: 'competition'
    },
    {
        id: 16,
        title: 'Roles',
        moduleName: 'Roles',
        icon: 'pi pi-shield',
        isActive: false,
        route: 'roles'
    }
]