import { trigger, transition, style, animate, query, group, state } from "@angular/animations";
import { formatDate } from "@angular/common";
import { signal } from "@angular/core";
import { Message } from "primeng/api";
import crypto from 'crypto-js';
import { AbstractControl, FormArray, FormGroup, ValidatorFn } from "@angular/forms";

export interface TableDeleteAction {
    isDeleteActionFired: boolean;
    data: any
}

export type SeverityType = 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'error';
const DOMAIN = 'Simas Academy';
export const utils = {
    domain: DOMAIN,
    headerHeight: '50px',
    mobileValidationPattern: '^\\+?[0-9]{10}$',
    apiConfigData: {},
    userType: signal<string>('admin'),
    addButtonTitle: signal<string>(''),
    menuItemClick: signal<any>({}),
    isMobile: signal<boolean>(false),
    isTablet: signal<boolean>(false),
    isTableLoading: signal<boolean>(false),
    isAddActionLoading: signal<boolean>(false),
    isTableDeleteAction: signal<boolean>(false),
    tableDeleteRowData: signal<any>({}),
    isTableEditAction: signal<boolean>(false),
    tableEditRowData: signal<any>({}),
    countryData: signal<any>({}),
    stateData: signal<any>({}),
    cityData: signal<any>({}),
    messages: signal<Message[]>([],),
    activeItem: signal<any>({}),
    permissionList: signal<any>([]),
    pageTitle: signal<string>(DOMAIN),
    getCleanPath(urlPath: string, pathId: string) {
        return urlPath.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', pathId);;
    },
    getRandomNumber(min = 100001, max = 5000001) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    encryptString(data: string, secret: string): string {
        return crypto.AES.encrypt(data, secret).toString();
    },
    decryptString(encText: string, secret: string): string {
        return crypto.AES.decrypt(encText, secret).toString(crypto.enc.Utf8);
    },
    setPageTitle(title: string) {
        this.pageTitle.set(this.domain + ` | ${title ? title : this.activeItem()}`);
    },
    alertTimer: 4000,
    setMessages(message: string, severity: SeverityType) {
        this.messages.update(val => [...val, { detail: message, severity }]);
        // this.messages.set([{ detail: message, severity }]);
    },
    clearMessage(index: number = -1) {
        this.messages.update((messages: any[]) => {
            if (index === 0 || index > -1) return messages.filter((_, i) => i !== index);
            else return [];
        })
    },
    isPageRefreshed: signal<boolean>(false),
    sideBarOpened: signal<boolean>(false),
    filterDataByColumns(columns: any[], dataList: any[]): any[] {
        return dataList.map(data => {
            const filteredData: any = {};
            columns.forEach(column => {
                if (data.hasOwnProperty(column.field)) {
                    const key = column.field;
                    const value = data[column.field];
                    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
                    if (dateFormatRegex.test(value)) {
                        const dateValue = new Date(value);
                        filteredData[key] = formatDate(dateValue, 'mediumDate', 'en-US');
                    } else {
                        filteredData[key] = value;
                    }
                }
            });
            return filteredData;
        });
    },
    rangeValidator(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;
            if (value < min || value > max) {
                return { rangeError: true };
            }
            return null;
        }
    },
    generatePassword(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }

        return password;
    },
    getInvalidControls(form: FormGroup | FormArray): any {
        const invalidControls: any[] = [];
        const recursiveFunc = (form: FormGroup | FormArray) => {
            Object.keys(form.controls).forEach(field => {
                const control = form.get(field);

                if (control instanceof FormGroup || control instanceof FormArray) {
                    recursiveFunc(control);
                } else if (control && control.invalid) {
                    invalidControls.push({ control: control, name: field });
                }
            });
        };
        recursiveFunc(form);
        return invalidControls;
    },
    getDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        let hours: any = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = String(hours).padStart(2, '0'); // Pad with zero if needed

        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

        return `${formattedDate}/ ${formattedTime}`;
    },
    getGreeting() {
        const now = new Date();
        const hours = now.getHours();
        if (hours >= 5 && hours < 12) {
            return "Good Morning";
        } else if (hours >= 12 && hours < 17) {
            return "Good Afternoon";
        } else if (hours >= 17 && hours < 21) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    },
    addSpaceBetweenWords(str: string) {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    },
    slideInRouter: trigger('routeAnimations', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 0 }),
            animate('50ms ease-out', style({ opacity: 0 }))
        ])
    ]),
    heightIncrease: trigger('grow', [
        state('void', style({
            height: '0px',
            opacity: 0,
            padding: '0px'
        })),
        state('*', style({
            height: '*',
            opacity: 1,
            padding: '*'
        })),
        transition('void => *', [
            animate('0.5s ease-out')
        ]),
        transition('* => void', [
            animate('0.5s ease-in')
        ])
    ])
}

export const base64Logo = `/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAACUklEQVR4nO3SMQ0AAAjDMO5f6dcVYQcCFnVuEoEA6EA5UB8UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UB4UB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UBwUB4UB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UBwUB4UB4UBwUB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB4UBwUB4UB4UB`;