import { UserRole, UserStatus } from "./user.entity";

export interface IRegisterData {
    fullName: string;
    email: string;
    username: string;
    password: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IAuthUser {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
}

export interface IUpdateUserData {
    username?: string;
    fullName?: string;
    email?: string;
    status?: UserStatus;
    role?: UserRole;
    bio?: string;
}

export interface ICreateUserData {
    username: string;
    fullName: string;
    email: string;
    status: UserStatus;
    role: UserRole;
    bio: string;
    password: string;
}

export interface IUsersQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}
