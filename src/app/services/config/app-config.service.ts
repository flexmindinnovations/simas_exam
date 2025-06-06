import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { utils } from '../../utils';

type ApiCallType = 'settings' | 'token' | 'login' | 'activation' | 'competition' | 'register' | 'instructor' | 'student' | 'franchise' | 'role' | 'level' | 'admin' | 'location' | 'exam' | 'examCenter' | 'examType' | 'examPaper' | 'questionBank' | 'reports' | 'questionPaper' | 'hallticket' | 'batchAllocation' | 'offlineStudent' | 'ageGroup' | 'result';

export type ApiCallConfig = {
  settings: {};
  token: {};
  login: {
    createToken: string;
    getToken: string;
    getTokenById: string;
  };
  register: {};
  instructor: {
    instructorList: string;
    instructorListByFranchiseId: string;
    instructorById: string;
    savetInstructor: string;
    updateInstructor: string;
    deleteInstructor: string;
  };
  student: {
    studentList: any;
    studentListByFranchiseId: any;
    studentListInstructorWise: any;
    studentById: (userId: string | number) => any,
    saveStudent: string;
    updateStudent: string;
    upload: string;
    uploadandUpdateStudent: string;
    deleteStudent: string;
    studentListWithBatchAllocation: any;
  };
  franchise: {
    franchiseList: string;
    franchiseById: string;
    uploadFranchise: string;
    saveFranchise: string;
    updateFranchise: string;
    deleteFranchise: string;
    uploadAndUpdateFranchise: string;
    franchiseTypeList: string;
    franchiseListByType: string;
  };
  role: {
    roleList: string;
    moduleList: string;
    rolePermissionsByRoleId: string;
    saveRoleMaster: string;
    updateRoleMaster: string;
  };
  level: {
    levelList: string;
    levelById: string;
    saveLevel: string;
    updateLevel: string;
    deleteLevel: string;
  };
  admin: {};
  location: {
    country: string;
    state: string;
    city: string;
  };
  exam: {
    examList: string;
    examById: string;
    saveExam: string;
    updateExam: string;
    deleteExam: string;
  };
  examCenter: {
    examCenterList: string;
    examCenterById: string;
    batchTimeSlotListByExamCenterId: string;
    saveExamCenter: string;
    updateExamCenter: string;
    deleteExamCenter: string;
  };
  examType: {
    examTypeList: string;
    examTypeById: string;
    saveExamType: string;
    updateExamType: string;
    deleteExamType: string;
  };
  examPaper: {
    examPaperList: string;
    SaveExamPaper: string;
    SaveExamPaperList: string;
    TempSaveExamPaperList: string
  };
  questionBank: {
    questionBankList: string;
    questionBankById: string;
    // questionBankListExamTypeAndLessonWise: string;
    // questionBankListExamTypeAndTypeWise: string;
    // questionBankListExamTypeAndLessonORTypeWise: string;
    // flashAnzanQuestionBankListExamTypeAndLevelWise: string;
    getFlashAnzanQuestionBankListExamTypeAndLevelWise: string;
    updateQuestionBank: string;
    uploadFile: string;
    deleteQuestionBank: string;
  };
  questionPaper: {
    getQuestionPaper: string;
    getQuestionPaperById: string;
    saveQuestionPaper: string;
    updateQuestionPaper: string;
    deleteQuestionPaper: string;
  };
  activation: {
    saveActivation: string;
    saveMultipleActivation: string;
    updateActivation: string;
    saveMultipleExamActivation: string
  };
  competition: {
    competitionList: string;
    competitionById: string;
    saveCompetition: string;
    updateCompetition: string;
  };
  reports: {
    examPaperExamTypeAndLevelwise: string;
    studentListFromExamPaperLevelAndRoundWise: string;
    studentListFromExamPaperFranchiseAndInstructorWise: string;
    studentExamPaperDetailsReport: string
  };
  hallticket: {
    getStudentHallTicketList: string;
  };
  batchAllocation: {
    getStudentInfoHallTicketNoWise: string;
    saveStudentBatchAllocation: string;
  };
  offlineStudent: {
    saveOfflineStudentMarkEntry: string;
    getOfflineStudentListCompititionIdWise: string;
  };
  ageGroup: {
    getAgeGroupList: string;
    saveAgeGroup: string;
    updateAgeGroup: string;
  },
  result: {
    getDisplayResultListCompititionAndLevelWise: (competitionId: string | number, level: string | number) => any,
    getDisplayResultListCompititionWise: (competitionId: string | number) => any,
  }

}
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {};
  public settings: any = {};

  hostUrl = environment.apiUrl;

  public apiConfigData: ApiCallConfig = {
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
      instructorListByFranchiseId: `${this.hostUrl}/Instructor/GetInstructorList?franchiseId={{id}}`,
      instructorById: `${this.hostUrl}/Instructor/GetInstructorById?id={{id}}`,
      savetInstructor: `${this.hostUrl}/Instructor/SavetInstructor`,
      updateInstructor: `${this.hostUrl}/Instructor/UpdateInstructor`,
      deleteInstructor: `${this.hostUrl}/Instructor​/Delete/{{id}}`,
    },
    student: {
      studentList: `${this.hostUrl}/Student/GetStudentList`,
      studentListByFranchiseId: (franchiseId = 0) => `${this.hostUrl}/Student/GetStudentList?franchiseId=${franchiseId}`,
      studentListInstructorWise: (instructorId: any | number) => `${this.hostUrl}/Student/GetStudentListInstructorWise?instructorId=${instructorId}`,
      studentById: (userId) => `${this.hostUrl}/Student/GetStudentById?id=${userId}`,
      saveStudent: `${this.hostUrl}/Student/SaveStudent`,
      updateStudent: `${this.hostUrl}/Student/UpdateStudent`,
      upload: `${this.hostUrl}/Student/Upload`,
      uploadandUpdateStudent: `${this.hostUrl}/Student/UploadandUpdateStudent`,
      deleteStudent: `${this.hostUrl} /Student/Delete/{{id}}`,
      studentListWithBatchAllocation: (competitionId: any | number, franchiseId: any | number) => `${this.hostUrl}/Student/GetStudentListWithBatchAllocation?compititionId=${competitionId}&franchiseId=${franchiseId}`,
    },
    franchise: {
      franchiseList: `${this.hostUrl}/Franchise/GetFranchiseList/{{id}}`,
      franchiseById: `${this.hostUrl}/Franchise/GetFranchiseById/{{id}}`,
      uploadFranchise: `${this.hostUrl}/Franchise/Upload`,
      saveFranchise: `${this.hostUrl}/Franchise/saveFranchise`,
      updateFranchise: `${this.hostUrl}/Franchise/updateFranchisee`,
      deleteFranchise: `${this.hostUrl}/Franchise​/Delete/{{id}}`,
      uploadAndUpdateFranchise: `${this.hostUrl}/Franchise/UploadAndUpdateFranchise`,
      franchiseTypeList: `${this.hostUrl}/FranchiseType`,
      franchiseListByType: `${this.hostUrl}/Franchise/GetFranchiseByFranchiseTypeId?franchiseTypeId={{id}}`,
    },
    level: {
      levelList: `${this.hostUrl}/Level/getLevelList`,
      levelById: `${this.hostUrl}/Level/getLevelListByLevelId/{{id}}`,
      saveLevel: `${this.hostUrl}/Level/saveLevel`,
      updateLevel: `${this.hostUrl}/Level/updateLevel`,
      deleteLevel: `${this.hostUrl}/Level/Delete/{{id}}`,
    },
    role: {
      roleList: `${this.hostUrl}/Role/GetRoleList`,
      moduleList: `${this.hostUrl}/Role/getModuleList`,
      rolePermissionsByRoleId: `${this.hostUrl}/Role/GetPermissionListByRoleId?roleId={{id}}`,
      saveRoleMaster: `${this.hostUrl}/Role/saveRoleMaster`,
      updateRoleMaster: `${this.hostUrl}/Role/updateRoleMaster`,
    },
    admin: {},
    location: {
      country: `${this.hostUrl}/Country/GetCountries`,
      state: `${this.hostUrl}/State/GetStateListByCountryId?countryId={{countryId}}`,
      city: `${this.hostUrl}/City/GetStateListByCityId?stateId={{stateId}}`
    },
    exam: {
      examList: `${this.hostUrl}/Exam/getExamList`,
      examById: `${this.hostUrl}/Exam/getExamById/{{id}}`,
      saveExam: `${this.hostUrl}/Exam/saveExam`,
      updateExam: `${this.hostUrl}/Exam/updateExam`,
      deleteExam: `${this.hostUrl}/Exam/Delete/{{id}}`,
    },
    // /api/ExamCenter/getBatchTimeSlotListByExamCenterId/{examCenterId}

    examCenter: {
      examCenterList: `${this.hostUrl}/ExamCenter/getExamCenterList`,
      examCenterById: `${this.hostUrl}/ExamCenter/getExamCenterById/{{id}}`,
      batchTimeSlotListByExamCenterId: `${this.hostUrl}/ExamCenter/getBatchTimeSlotListByExamCenterId/{{id}}`,
      saveExamCenter: `${this.hostUrl}/ExamCenter/saveExamCenter`,
      updateExamCenter: `${this.hostUrl}/ExamCenter/updateExamCenter`,
      deleteExamCenter: `${this.hostUrl}/ExamCenter/Delete/{{id}}`,
    },
    examType: {
      examTypeList: `${this.hostUrl}/ExamType/getExamTypeList`,
      examTypeById: `${this.hostUrl}/ExamType/getExamTypeById/{{id}}`,
      saveExamType: `${this.hostUrl}/ExamType/saveExamType`,
      updateExamType: `${this.hostUrl}/ExamType/updateExamType`,
      deleteExamType: `${this.hostUrl}/ExamType/Delete/{{id}}`,
    },
    examPaper: {
      examPaperList: `${this.hostUrl}/ExamPaper/getExamPaper`,
      SaveExamPaper: `${this.hostUrl}/ExamPaper/SaveExamPaper`,
      SaveExamPaperList: `${this.hostUrl}/ExamPaper/SaveExamPaperList`,
      TempSaveExamPaperList: `${this.hostUrl}/ExamPaper/TempSaveExamPaperList`,
    },
    questionBank: {
      questionBankList: `${this.hostUrl}/QuestionBank/getQuestionBankList`,
      questionBankById: `${this.hostUrl}/QuestionBank/getQuestionBankById/{{id}}`,
      // questionBankListExamTypeAndLessonWise: `${this.hostUrl}/QuestionBank/getQuestionBankListExamTypeAndLessonWise`,
      // questionBankListExamTypeAndTypeWise: `${this.hostUrl}/QuestionBank/getQuestionBankListExamTypeAndTypeWise`,
      // questionBankListExamTypeAndLessonORTypeWise: `${this.hostUrl}/QuestionBank/getQuestionBankListExamTypeAndLessonORTypeWise`,
      // flashAnzanQuestionBankListExamTypeAndLevelWise: `${this.hostUrl}/QuestionBank/getFlashAnzanQuestionBankListExamTypeAndLevelWise`,
      getFlashAnzanQuestionBankListExamTypeAndLevelWise: `${this.hostUrl}/QuestionBank/getFlashAnzanQuestionBankListExamTypeAndLevelWise`,
      updateQuestionBank: `${this.hostUrl}/QuestionBank/updateQuestionBank`,
      uploadFile: `${this.hostUrl}/QuestionBank/uploadFile`,
      deleteQuestionBank: `${this.hostUrl}/QuestionBank/Delete/{{id}}`
    },
    questionPaper: {
      getQuestionPaper: `${this.hostUrl}/QuestionPaper/getQuestionPaper`,
      getQuestionPaperById: `${this.hostUrl}/QuestionPaper/getQuestionPaperById/{{id}}`,
      saveQuestionPaper: `${this.hostUrl}/QuestionPaper/saveQuestionPaper`,
      updateQuestionPaper: `${this.hostUrl}/QuestionPaper/updateQuestionPaper`,
      deleteQuestionPaper: `${this.hostUrl}/QuestionPaper/Delete/{{id}}`
    },
    activation: {
      saveActivation: `${this.hostUrl}/Activation/SaveActivation`,
      updateActivation: `${this.hostUrl}/Activation/UpdateActivation`,
      saveMultipleActivation: `${this.hostUrl}/Activation/SaveMultipleActivation`,
      saveMultipleExamActivation: `${this.hostUrl}/Activation/SaveMultipleExamActivation`
    },
    competition: {
      competitionList: `${this.hostUrl}/Compitition/getCompititionList`,
      competitionById: `${this.hostUrl}/Compitition/getCompititionById/{{id}}`,
      saveCompetition: `${this.hostUrl}/Compitition/SaveCompititionMaster`,
      updateCompetition: `${this.hostUrl}/Compitition/updateCompititionMaster`,
    },
    reports: {
      examPaperExamTypeAndLevelwise: `${this.hostUrl}/Report/getExamPaperExamTypeAndLevelwise`,
      studentListFromExamPaperLevelAndRoundWise: `${this.hostUrl}/Report/getStudentListFromExamPaperLevelAndRoundWise`,
      studentListFromExamPaperFranchiseAndInstructorWise: `${this.hostUrl}/Report/getStudentListFromExamPaperFranchiseAndInstructorWise`,
      studentExamPaperDetailsReport: `${this.hostUrl}/Report/getExamPaperDetailsReport`
    },
    hallticket: {
      getStudentHallTicketList: `${this.hostUrl}/StudentBatchAllocation/getStudentListFromBatchAllocationFranchiseAndInstructorWise`
    },
    batchAllocation: {
      getStudentInfoHallTicketNoWise: `${this.hostUrl}/StudentBatchAllocation/getStudentInfoHallTicketNoWise`,
      saveStudentBatchAllocation: `${this.hostUrl}/StudentBatchAllocation/saveStudentBatchAllocation`,
    },
    offlineStudent: {
      saveOfflineStudentMarkEntry: `${this.hostUrl}/OfflineStudentMarkEntry/saveOfflineStudentMarkEntry`,
      getOfflineStudentListCompititionIdWise: `${this.hostUrl}/OfflineStudentMarkEntry/getOfflineStudentListCompititionIdWise`,
    },
    ageGroup: {
      getAgeGroupList: `${this.hostUrl}/AgeGroupMaster/GetAgeGroupList`,
      saveAgeGroup: `${this.hostUrl}/AgeGroupMaster/SaveAgeGroupMaster`,
      updateAgeGroup: `${this.hostUrl}/AgeGroupMaster/updateAgeGroupMaster`
    },
    result: {
      getDisplayResultListCompititionAndLevelWise: (competitionId: any | number, levelId: any | number) => `${this.hostUrl}/Result/getDisplayResultListCompititionAndLevelWise/${competitionId}/${levelId}`,
      getDisplayResultListCompititionWise: (competitionId: any | number) => `${this.hostUrl}/Result/getDisplayResultListCompititionWise/${competitionId}`
    }
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
