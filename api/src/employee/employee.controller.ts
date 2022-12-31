import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import * as utils from "lib/utils"
// import type { Employee } from "lib/types"
import { ROLES } from 'lib/types';
import { PrismaClient, Prisma, Employee } from '@prisma/client';
import { CreateEmployeeDTO, UpdateEmployeeAsAdminDTO } from 'lib/dtos';
import { DateTime } from 'luxon';
import { EmployeeService } from './employee.service';
import { Roles } from 'roles/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

@Controller('employee')
export class EmployeeController {

    constructor(private readonly employeeService: EmployeeService) {}

    
    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    @Get(["/complete", "/complete/:cursor"])
    async getCompleteEmployees(@Param() param, @Req() request: Request): Promise<Partial<Employee>[]> {
        
        return await this.employeeService.getManyCompleteResponses(param.cursor || 0)
    }

    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    @Get(["/incomplete/:cursor", "/incomplete"])
    async getInCompleteEmployees(@Param() param, @Req() request: Request): Promise<Partial<Employee>[]> {
        let employees = await this.employeeService.getManyIncompleteResponses(param.cursor || 0); 
        return employees
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id")
    async getOneEmployee(@Param() param, @Req() request: Request): Promise<Partial<Employee>> {
        return await this.employeeService.getOneEmployee(param.id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async putEmployee(@Param() param, @Req() request: Request, @Body() body: UpdateEmployeeAsAdminDTO): Promise<void> {

        return await this.employeeService.updateEmployee(param.id, body)
    }

    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    @Post()
    async postEmployee(@Req() request: Request, @Body() body: CreateEmployeeDTO): Promise<void> {
        await this.employeeService.createEmployee(body);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    @Delete(":id")
    async deleteEmployee(@Param() param, @Req() request: Request): Promise<void> {
        await this.employeeService.deleteEmployee(param.id);

    }

}