export interface Employee {
    id: String;
    userId: Number;
    firstName: String;
    lastName: String;
    username:String;
    accessCode: Number;
}

export interface Admin {
    id: Number;
    userId: Number;
    username: String;
    password: String;
}

export interface Token {
    id: Number;
    isAdmin: Boolean;
    userId: Number;
    secretKey: String;
    expires: Date; 
}

export interface Cookie {
    userId?: string;
    secretKey?: string;
}

export enum ROLES {
    USER,
    ADMIN
}