import { User } from "../user";

export interface AuthLoginResponse {
    accessToken: string,
    user: User
}