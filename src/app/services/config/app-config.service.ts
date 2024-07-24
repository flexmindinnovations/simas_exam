import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { utils } from '../../utils';

type ApiCallType = 'settings' | 'token' | 'login' | 'register' | 'instructor' | 'student' | 'franchise' | 'role' | 'admin' | 'location' | 'exam' | 'examType';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {};
  public settings: any = {};

  hostUrl = environment.apiUrl;

  public apiConfigData = {
    token: {},
    settings: {},
    login: {
      createToken: `${this.hostUrl}/Token/createToken`,
      getToken: `${this.hostUrl}/Token/Get`,
      getTokenById: `${this.hostUrl}/Token/Get/{{tokenId}}`,
    },
    register: {},
    instructor: {
      instructorList: `${this.hostUrl}/Instructor/GetInstructorList`,
      instructorById: `${this.hostUrl}/Instructor/GetInstructorById?instructorId={{id}}`,
      savetInstructor: `${this.hostUrl}/Instructor/SavetInstructor`,
      updateInstructor: `${this.hostUrl}/Instructor/UpdateInstructor`,
      deleteInstructor: `${this.hostUrl}​​/Instructor​/Delete​/{{id}}`,
    },
    student: {
      studentList: `${this.hostUrl}/Student/GetStudentList`,
      studentById: `${this.hostUrl}/Student/GetStudentById?studentId={{id}}`,
      savetStudent: `${this.hostUrl}/Student/SavetStudent`,
      updateStudent: `${this.hostUrl}/Student/UpdateStudent`,
      deleteStudent: `${this.hostUrl}​​/Student/Delete​/{{id}}`,
    },
    franchise: {
      franchiseList: `${this.hostUrl}/Franchise/GetFranchiseList`,
      franchiseById: `${this.hostUrl}/Franchise/GetFranchiseById/{{id}}`,
      uploadFranchise: `${this.hostUrl}/Franchise/Upload`,
      saveFranchise: `${this.hostUrl}/Franchise/saveFranchise`,
      updateFranchise: `${this.hostUrl}/Franchise/updateFranchisee`,
      deleteFranchise: `${this.hostUrl}​​/Franchise​/Delete​/{{id}}`,
      uploadAndUpdateFranchise: `${this.hostUrl}/Franchise/UploadAndUpdateFranchise`,
      franchiseTypeList: `${this.hostUrl}/FranchiseType`,
      franchiseListByType: `${this.hostUrl}/Franchise/GetFranchiseByFranchiseTypeId?franchiseTypeId={{id}}`,
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

  public get(key: ApiCallType) {
    //   if (key === 'settings' || key === 'token') return this.settings[key];
    // }
    return this.config[key];
  }

  public set(key: string, value: any) {
    // if (key === 'settings' || key === 'token') this.settings[key] = value;
    // else this.config[key] = value;
    this.config[key] = value;
  }

  public loadStaticSettings() {
    this.config = this.apiConfigData;
    this.set('settings', this.apiConfigData);
  }
}
