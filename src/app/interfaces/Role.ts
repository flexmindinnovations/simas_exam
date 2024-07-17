import { Permission } from './Permissions';

export interface Role {
    roleId: number;
    roleName: string;
    permissionList: Array<Permission>;
}
