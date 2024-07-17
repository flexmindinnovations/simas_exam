export interface Permission {
    permissionId: number;
    moduleId: number;
    moduleName: string | null;
    roleId: number;
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
}
