import { HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { Cookie, ROLES, Token } from "lib/types"

export function parseCookie(str: string): Cookie {
    let obj: Cookie = {};
    let items: string[] = str.split("&");
    for (let item of items) {
        if (item.split("=")[0] == "userId")
            obj.userId = item.split("=")[1];
        if (item.split("=")[0] == "secretKey")
            obj.secretKey = item.split("=")[1];            
    }
    return obj;
}

export function randString(size: number): string {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < size; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function checkAuthStatus(prisma: PrismaClient, request: Request): Promise<ROLES> {
    let token: Token;

    try {
        token = await prisma.token.findUnique({
            where: {
                userId: request.headers.get("Authorization").split(":")[0],
                secretKey: request.headers.get("Authorization").split(":")[1]
            }
        })

        if (!(DateTime.fromISO(token.expires) >= DateTime.now())) {
            throw new Error()
        }
    } catch (e)
    {
        throw new HttpException("Not authorized", HttpStatus.FORBIDDEN);   
    }

    return token.isAdmin ? ROLES.ADMIN : ROLES.USER;
}

export async function checkIdStatus(prisma: PrismaClient, userId: string): Promise<ROLES> {
    let token: Token;

    try {
        token = await prisma.token.findUnique({
            where: {
                userId: userId,
            }
        })

        if (!(DateTime.fromISO(token.expires) >= DateTime.now())) {
            throw new Error()
        }
    } catch (e)
    {
        throw new HttpException("Not authorized", HttpStatus.FORBIDDEN);   
    }

    return token.isAdmin ? ROLES.ADMIN : ROLES.USER;
}

export function makeId(length: Number): string {
    let result           = '';
    let characters       = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}