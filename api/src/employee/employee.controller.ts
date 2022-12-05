import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import * as utils from "lib/utils"
import type { Employee } from "lib/types"
import { ROLES } from 'lib/types';
import { PrismaClient } from '@prisma/client';
import { CreateEmployeeDTO, UpdateEmployeeAsAdminDTO } from 'lib/dtos';
import { DateTime } from 'luxon';

let prisma = new PrismaClient()


@Controller('employee')
export class EmployeeController {



    @Get("/:id")
    async getOneEmployee(@Param() param, @Req() request: Request): Promise<Employee> {
        
        prisma.$connect()
        utils.checkAuthStatus(prisma, request);

        let employee: Employee

        try {
            employee = await prisma.employee.findUnique({
                where: {
                    userId: param.id
                }
            })
        } catch (e) {
            throw new HttpException("Couldn't find employee", HttpStatus.NOT_FOUND)
        }

        return employee;
    }

    @Get("/:count")
    async getEmployees(@Param() param, @Req() request: Request): Promise<Employee[]> {
        
        prisma.$connect()
        utils.checkAuthStatus(prisma, request);

        let employees: Employee[]
        
        try {
            employees = await prisma.employee.findMany({
               where: {
                    submitted: false
               }
            })

            employees.push(await prisma.employee.findMany({
                where: {
                    submitted: true
                },
                orderBy: {
                    date: 
                },
                cursor: 
                take: 25
            }))
        } catch (e) {
            throw new HttpException("Couldn't find employee", HttpStatus.NOT_FOUND)
        }
        
        return employees;
    }

    @Put(":id")
    async putEmployee0 (@Param() param, @Req() request: Request, @Body() body) {
        prisma.$connect();
        utils.checkAuthStatus(prisma, request)
    }
    async putEmployee(@Param() param, @Req() request: Request, @Body() body: UpdateEmployeeAsAdminDTO): Promise<void> {

        prisma.$connect()
        let mode: ROLES = await utils.checkAuthStatus(prisma, request);
        try {
            prisma.employee.update({
                where: {
                    userId: param.id,
                },
                data: body
            })
        } catch (e) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    async postEmployee(@Req() request: Request, @Body() body: CreateEmployeeDTO): Promise<void> {

        let data: any = CreateEmployeeDTO;   

        data.accessCode = utils.makeId(6);
        data.username = body.lastName.toLowerCase() + data.firstName()[0].toLowerCase() + utils.makeId(3);

        prisma.$connect();
        let mode: ROLES = await utils.checkAuthStatus(prisma, request);

        if (mode !== ROLES.ADMIN) 
            throw new HttpException("Not authorized", HttpStatus.FORBIDDEN);

        try {
            prisma.employee.create({
                data: data
            });
        } catch (e) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(":id")
    async deleteEmployee(@Param() param, @Req() request: Request): Promise<void> {
        let data = await request.json()
        prisma.$connect();
        let mode: ROLES = await utils.checkAuthStatus(prisma, request);

        if (mode !== ROLES.ADMIN) 
            throw new HttpException("Not authorized", HttpStatus.FORBIDDEN);

        try {
            prisma.employee.delete({
                where: {
                    userId: param.id
                }
            });
        } catch (e) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }

    }

}