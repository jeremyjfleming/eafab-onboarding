import { HttpException, HttpStatus, Redirect } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { ROLES } from "lib/types"

export function randString(size: number): string {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < size; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export function makeId(length: Number): number {
    let result           = '';
    let characters       = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result);
}

