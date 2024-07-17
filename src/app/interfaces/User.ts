import { Franchise } from "./Fanchise";
import { Instructor } from "./Instructor";
import { Student } from "./Student";

export interface UserModel {
    id: number;
    userId: number;
    userName: string | null;
    userPassword: string | null;
    roleId: number;
    roleName: string | null;
    token: string | null;
    student: Array<Student>;
    franchise: Array<Franchise>;
    instructor: Array<Instructor>;
    isError: boolean;
    error: string | null;
}