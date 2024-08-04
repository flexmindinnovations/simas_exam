import Dexie, { Table } from 'dexie';

export interface RoleItem {
    roleId: number;
    roleName: string;
    permissionList: Array<PermissionItem>
}

export interface PermissionItem {
    permissionId: number;
    moduleId: number,
    moduleName: string,
    roleId: number,
    canView: boolean,
    canAdd: boolean,
    canEdit: boolean,
    canDelete: boolean
}

export class AppDB extends Dexie {
    roleItem!: Table<RoleItem, number>;
    permissiontem!: Table<PermissionItem, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(1).stores({
            roleItem: '++id',
            permissiontem: '++id'
        })
    }
}

export const db = new AppDB();