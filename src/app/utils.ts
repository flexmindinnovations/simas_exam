import { trigger, transition, style, animate, query, group } from "@angular/animations";
import { formatDate } from "@angular/common";
import { signal } from "@angular/core";
import { Message } from "primeng/api";
import crypto from 'crypto-js';

export interface TableDeleteAction {
    isDeleteActionFired: boolean;
    data: any
}

export type SeverityType = 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'error';
const DOMAIN = 'Simas Academy';
export const utils = {
    domain: DOMAIN,
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
    messages: signal<Message[]>([]),
    activeItem: signal<any>({}),
    pageTitle: signal<string>(DOMAIN),
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
    setMessages(message: string, severity: SeverityType) {
        this.messages.update((val: Message[]) => [...val, { detail: message, severity }])
    },
    alertTimer: 3500,
    isPageRefreshed: signal<boolean>(false),
    sideBarOpened: signal<boolean>(true),
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
    slideInRouter: trigger('routeAnimations', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 0 }),
            animate('50ms ease-out', style({ opacity: 0 }))
        ])
    ])
}