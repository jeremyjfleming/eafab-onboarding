import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import * as utils from "lib/utils"
// import type { Employee } from "lib/types"
import { ROLES } from 'lib/types';
import { PrismaClient, Prisma, Employee } from '@prisma/client';
import { CreateEmployeeDTO, UpdateEmployeeAsUserDTO } from 'lib/dtos';
import { DateTime } from 'luxon';
import { EmployeeService } from './employee.service';
import { Roles } from 'roles/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RolesGuard } from 'roles/roles.guard';

@Controller('employee')
export class EmployeeController {

    constructor(private readonly employeeService: EmployeeService) {}

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get(["/complete", "/complete/:cursor"])
    async getCompleteEmployees(@Param() param, @Req() request: Request): Promise<Partial<Employee>[]> {
        
        return await this.employeeService.getManyCompleteResponses(param.cursor || 0)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get(["/incomplete/:cursor", "/incomplete"])
    async getInCompleteEmployees(@Param() param, @Req() request: Request): Promise<Partial<Employee>[]> {
        let employees = await this.employeeService.getManyIncompleteResponses(param.cursor || 0); 
        return employees
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id")
    async getOneEmployee(@Param() param, @Req() request: Request): Promise<Partial<Employee>> {
        let result = await this.employeeService.getOneEmployee({userId: parseInt(param.id)})
        if (!result)
            throw new NotFoundException()
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put("/:id")
    async putEmployee(@Param() param, @Req() request: Request, @Body() body: UpdateEmployeeAsUserDTO): Promise<void> {

        let exists = await this.employeeService.getOneEmployee({ userId: parseInt(param.id)})
        if (!exists)
            throw new NotFoundException()

        await this.employeeService.updateEmployee(parseInt(param.id), body)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    @Post()
    async postEmployee(@Req() request: Request, @Body() body: CreateEmployeeDTO): Promise<void> {
        await this.employeeService.createEmployee(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    @Delete("/:id")
    async deleteEmployee(@Param() param, @Req() request: Request): Promise<void> {

        let exists = await this.employeeService.getOneEmployee({ userId: parseInt(param.id)})
        if (!exists)
            throw new NotFoundException()

        await this.employeeService.deleteEmployee(parseInt(param.id));

    }

}