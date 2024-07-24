export interface Login {
    createToken: string,
    getToken: string,
    getTokenById: string,
}

export interface Franchise {
    franchiseList: string,
    franchiseById: string,
    uploadFranchise: string,
    saveFranchise: string,
    updateFranchise: string,
    deleteFranchise: string,
    uploadAndUpdateFranchise: string,
    franchiseTypeList: string,
    franchiseListByType: string,
}

export interface Instructor {
    instructorList: string,
    instructorById: string,
    savetInstructor: string,
    updateInstructor: string,
    deleteInstructor: string,
}
export interface Student {
    studentList: string,
    studentById: string,
    savetStudent: string,
    updateStudent: string,
    deleteStudent: string,
}

export interface RoleList {
    roleList: string,
    permissionRoleListByRoleId: string,
    saveRoleMaster: string,
    updateRoleMaster: string,
}

export interface Location {
    country: string,
    state: string,
    city: string
}