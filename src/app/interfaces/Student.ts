export interface Student {
    studentId: number;
    studentFirstName: string | null;
    studentMiddleName: string | null;
    studentLastName: string | null;
    address1: string | null;
    mobileNo: string | null;
    userPassword: string | null;
    dob: string; // ISO date string
    standard: string | null;
    studentPhoto: string | null;
    schoolName: string | null;
    emailId: string | null;
    franchiseTypeId: number;
    franchiseId: number;
    levelId: number;
    instructorId: number;
    status: string | null;
    stuPass: string | null;
    franchiseTypeName: string | null;
    franchiseName: string | null;
    instructorName: string | null;
    levelName: string | null;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
}
