import { IChangePassword, ILoginCredentials, IRegisterData } from "../../users/models/user.dto";
import { IUserEntity } from "../../users/models/user.entity";


export interface IAuthService {
    registerUser(
        data: IRegisterData
    ): Promise<IUserEntity>;

    loginUser(data: ILoginCredentials): Promise<{ user: IUserEntity; accessToken: string; refreshToken: string }>;

    logoutUser(userId: string): Promise<IUserEntity | null>;

    refreshAccessToken(
        incomingRefreshToken: string
    ): Promise<{ accessToken: string }>;

    changeUserPassword(data: IChangePassword, userId: string): Promise<void>;
}
