export interface AuthLoginResponse {
    accessToken: string,
    user: {
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: any,
    }
}