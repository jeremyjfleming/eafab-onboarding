export enum ROLES {
    USER = 'user',
    ADMIN = 'admin'
}

export type JwtResponse = {
    access_token: string
    user: string
}