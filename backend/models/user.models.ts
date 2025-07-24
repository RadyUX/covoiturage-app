export interface User{
    id?: number;
    lastname: string;
    firstname: string;
    email: string;
    password: string;
    telephone?: string;
    adress?: string;
    birthdate?: Date;
    photo?: string;
    pseudo: string;
}