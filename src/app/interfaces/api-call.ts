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
    getFranchiseType: string,
}

export interface Instructor {
    getInstructorList: string,
    getInstructorById: string,
    savetInstructor: string,
    updateInstructor: string,
    deleteInstructor: string,
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