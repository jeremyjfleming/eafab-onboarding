import type { Cookie } from "src/lib/types"

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