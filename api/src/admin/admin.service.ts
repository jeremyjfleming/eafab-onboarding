import { Injectable } from '@nestjs/common';
import { Admin, PrismaClient } from '@prisma/client';

let prisma = new PrismaClient()

@Injectable()
export class AdminService {
    async getOneAdmin(username: string): Promise<Admin> {

        prisma.$connect();
        return await prisma.admin.findUnique({
            where: {
                username: username
            }
        })
    }
}
