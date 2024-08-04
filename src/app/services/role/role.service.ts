import { AppConfigService } from './../config/app-config.service';
import { Injectable } from '@angular/core';
import { ApiCallConfig } from '../config/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  rolesPath: ApiCallConfig['role'];
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient
  ) {
    this.rolesPath = appConfigService.get('role');
  }

  getRoleList(): Observable<any> {
    return this.http.get(this.rolesPath.roleList);
  }

  getModuleList(): Observable<any> {
    return this.http.get(this.rolesPath.moduleList);
  }

  getRolePermissionsById(roleId: string): Observable<any> {
    const roleByIdPath = this.rolesPath.rolePermissionsByRoleId.replace(/\s+/g, '').replace(/\u200B/g, '').replace('{{id}}', roleId);
    return this.http.get(roleByIdPath);
  }

  saveRole(payload: any): Observable<any> {
    return this.http.post(this.rolesPath.saveRoleMaster, payload);
  }

  updateRole(payload: any): Observable<any> {
    return this.http.post(this.rolesPath.updateRoleMaster, payload);
  }
}
