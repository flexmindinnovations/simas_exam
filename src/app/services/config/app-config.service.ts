import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {};
  public settings: any = {};

  hostUrl = environment.apiUrl;

  public apiConfigData = {
    login: {
      createToken: `${this.hostUrl}/Token/createToken`,
      getToken: `${this.hostUrl}/Token/Get`,
      getTokenById: `${this.hostUrl}/Token/Get/{{tokenId}}`,
    },
    register: {},
    instructor: {
      getInstructorList: `${this.hostUrl}/Instructor/GetInstructorList`,
      getInstructorById: `${this.hostUrl}/Instructor/GetInstructorById`,
      savetInstructor: `${this.hostUrl}/Instructor/SavetInstructor`,
      updateInstructor: `${this.hostUrl}/Instructor/UpdateInstructor`,
      deleteInstructor: `${this.hostUrl}​​/Instructor​/Delete​/{id}`,
    },
    student: {},
    franchise: {
      franchiseList: `${this.hostUrl}/Franchise/GetFranchiseList`,
      franchiseById: `${this.hostUrl}/Franchise/GetFranchiseById/{{id}}`,
      uploadFranchise: `${this.hostUrl}/Franchise/Upload`,
      saveFranchise: `${this.hostUrl}/Franchise/saveFranchise`,
      updateFranchise: `${this.hostUrl}/Franchise/updateFranchisee`,
      deleteFranchise: `${this.hostUrl}​​/Franchise​/Delete​/{{id}}`,
      uploadAndUpdateFranchise: `${this.hostUrl}/Franchise/UploadAndUpdateFranchise`,
      getFranchiseType: `${this.hostUrl}/Franchise/GetFranchiseByFranchiseTypeId`,
    },
    role: {
      roleList: `${this.hostUrl}/Role/GetRoleList`,
      permissionRoleListByRoleId: `${this.hostUrl}/Role/GetPermissionListByRoleId`,
      saveRoleMaster: `${this.hostUrl}/Role/saveRoleMaster`,
      updateRoleMaster: `${this.hostUrl}/Role/updateRoleMaster`,
    },
    admin: {},
    location: {
      country: `${this.hostUrl}/Country/GetCountries`,
      state: `${this.hostUrl}/State/GetStateListByCountryId?countryId={{countryId}}`,
      city: `${this.hostUrl}/City/GetStateListByCityId?stateId={{stateId}}`
    },
    exam: {},
    examType: {},

  }

  constructor() { }

  public get(key: string) {
    if (key === 'settings' || key === 'token') return this.settings[key];
    else return this.config[key];
  }

  public set(key: string, value: any) {
    if (key === 'settings' || key === 'token') this.settings[key] = value;
    else this.config[key] = value;
  }

  public loadStaticSettings() {
    this.config = this.apiConfigData;
    this.set('settings', this.apiConfigData);
  }
}
