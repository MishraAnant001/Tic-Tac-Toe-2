export interface IUser{
    name: string;
    email: string;
    password?: string;
    socialLoginId?: string;
    socialLoginProvider?: string;
}