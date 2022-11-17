import { Controller, Get, HttpException, HttpStatus, Req } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient = new PrismaClient()

@Controller('signout')
export class SignoutController {
    @Get()
    async signout(@Req() request: Request): Promise<void> {
        await prisma.$connect();

        if (request.headers.get("Authorization") == "") {
            throw new HttpException("Not authorized", HttpStatus.FORBIDDEN);
        }

        try {
            prisma.token.delete({
                where: {
                    userId: request.headers.get("Authorization").split(":"),
                    secretKey: request.headers.get("Authorization").split(":")
                }
            })
        } catch (e) {
            throw new HttpException("Not authorized", HttpStatus.FORBIDDEN)
        }
    }
}
