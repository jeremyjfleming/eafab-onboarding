import { Controller, Get, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import type { Employee, Admin } from 'src/lib/types';
import { ROLES } from 'src/lib/types';
import { PrismaClient } from '@prisma/client'
import type { Response } from 'express';
import * as utils from "src/lib/utils"
import { DateTime } from "luxon"

const prisma = new PrismaClient()

@Controller('signin')
export class SigninController {
    @Get("/eafab/signin")
    async signin(@Req() request: Request, @Res() response: Response): Promise<Response> {

        let data = await request.json();

        if (!(data.hasOwnProperty("username")) || !(data.hasOwnProperty("accessCode") ^ data.hasOwnProperty("password"))) { // make sure we have the fields we need 
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
        }

        let mode: ROLES = checkRole(data)

        await prisma.$connect();

        try {
            if (mode = ROLES.ADMIN)
            {
                let admin: Admin = await prisma.admin.findUnique({
                    where: {
                        username: data.username,
                        password: data["password"]
                    }
                })
                response.json(admin);

                let secretKey: string = utils.randString(12);
                prisma.token.create({
                    isAdmin: true,
                    userId: admin.userId,
                    secretKey: secretKey,
                    expires: DateTime.now().plus({minutes: 30}).toISO()
                })
                response.setHeader("Authorization:", admin.userId + ":" + secretKey)
            }
            if (mode = ROLES.USER)
            {
                let employee: Employee = await prisma.employee.findUnique({
                    where: {
                        username: data.username,
                        password: data["accessCode"]
                    }
                }) 
                response.json(employee);

                let secretKey: string = utils.randString(12); 
                prisma.token.create({
                    isAdmin: false,
                    userId: employee.userId,
                    secretKey: secretKey,
                    expires: DateTime.now().plus({minutes: 30}).toISO()
                })
                response.setHeader("Authorization:", employee.userId + ":" + secretKey)
            }

        } catch (e) {
            throw new HttpException("Username or password not found", HttpStatus.NOT_FOUND)
        }

        return response;
    }
    
}
function checkRole(request: Object): ROLES {
    let mode: ROLES;

    if (request.hasOwnProperty("accessCode")) {
        mode = ROLES.USER;
    }

    else if (request.hasOwnProperty("password")) {
        mode = ROLES.ADMIN;
    }

    return mode;
}
