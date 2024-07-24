export interface Franchise {
    franchiseTypeId: number;
    franchiseId: number;
    ownerName: string;
    franchiseName: string;
    address1: string;
    emailId: string;
    joiningDate: string; // ISO date string
    logoPath: string;
    countryId: number;
    stateId: number;
    cityId: number;
    userPassword: string | null;
    countryName: string;
    stateName: string;
    cityName: string;
    franchiseTypeName: string;
    mobileNo: string;
    status: string;
    franchiseePassword: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
}