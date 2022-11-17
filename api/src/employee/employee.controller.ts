import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import * as utils from "src/lib/utils"
import type { Employee } from "src/lib/types"
import { ROLES } from 'src/lib/types';
import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient()

@Controller('employee')
export class EmployeeController {

    @Get("/eafab/employee/:id")
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

    @Get("/eafab/employee")
    async getEmployees(@Req() request: Request): Promise<Employee[]> {
        
        prisma.$connect()
        utils.checkAuthStatus(prisma, request);

        let employees: Employee[]
        
        try {
            employees = await prisma.employee.findMany()
        } catch (e) {
            throw new HttpException("Couldn't find employee", HttpStatus.NOT_FOUND)
        }
        
        return employees;
    }

    @Put("/eafab/employee/:id")
    async putEmployee(@Param() param, @Req() request: Request): Promise<void> {

        let data = await request.json()
        prisma.$connect()
        let mode: ROLES = await utils.checkAuthStatus(prisma, request);

        if (data.hasOwnProperty("accessCode") || data.hasOwnProperty("id") || data.hasOwnProperty("userId")) {
            throw new HttpException("Bad request. These attributes cannot be modified", HttpStatus.BAD_REQUEST);
        }

        if (mode == ROLES.ADMIN && data.hasOwnProperty("formReponses"))
            throw new HttpException("Admins cannot modify this attribute.", HttpStatus.FORBIDDEN);

        if (mode == ROLES.USER && (data.hasOwnProperty("firstName") || data.hasOwnProperty("lastName") || data.hasOwnProperty("username") || data.hasOwnProperty("trainer") || data.hasOwnProperty("position"))) {
            throw new HttpException("Employees cannot modify this attribute.", HttpStatus.FORBIDDEN);
        }
        try {
            prisma.employee.update({
                where: {
                    userId: param.id,
                },
                data: data
            })
        } catch (e) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }
    }

    @Post("/eafab/employee")
    async postEmployee(@Req() request: Request): Promise<void> {

        let data = await request.json()
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

    @Delete("eafab/employee/:id")
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