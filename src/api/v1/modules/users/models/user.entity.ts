export enum UserRole {
    USER = "user",
    EDITOR = "editor",
    AUTHOR = "author",
    ADMIN = "admin",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface IUserPreferences {
    emailNotifications: boolean;
    marketingUpdates: boolean;
    twoFactorAuth: boolean;
}

export interface ISocialLinks {
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
}

/**
 * Pure domain model — DB agnostic
 */
export interface IUserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar: string | null;
    bio: string;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
    socialLinks: ISocialLinks;
    followers: string[];
    following: string[];
    refreshToken: string | null;
    preferences: IUserPreferences;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}
