import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Employee } from '@prisma/client';
import { LocalAuthGuard } from 'auth/local-auth.guard';
import { CreateEmployeeDTO, SectionResponseDTO, UpdateEmployeeAsAdminDTO } from 'lib/dtos';
import * as utils from 'lib/utils';
import { DateTime } from "luxon"


let prisma = new PrismaClient()

@Injectable()
export class EmployeeService {
    
    async getOneEmployee(obj: {userId?: number; username?: string}): Promise<Partial<Employee>> {
        
        prisma.$connect()
        
        // utils.checkAuthStatus(prisma, request);

        let employee: Employee

        try {
            employee = await prisma.employee.findUnique({
                where: obj
            })
        } catch (e) {
            return null;
        }

        if (employee == null)
            return employee;

        let {accessCode, ...result} = employee;
        result.formResponses.date = this.convertDate(result.formResponses.date);
        return result;
    }

    convertDate(isoString: string): string {
        if (!isoString)
            return "";
        let iso = DateTime.fromISO(isoString);
        return iso.toLocaleString(DateTime.DATETIME_MED);
    }

    async getManyIncompleteResponses(cursor: number): Promise<Partial<Employee>[]> {
        // utils.checkAuthStatus(prisma, request);
        
        let employees: Employee[]
        
        try {
            employees = await prisma.employee.findMany({
               where: {
                    submitted: false
               },
               orderBy: {
                    createId: "desc"
               },
               cursor: {
                    createId: cursor
               },
               take: 25
            })
        } catch (e) {
            return null;
        }


        let results = []
        for (let i in employees)
        {
            let { accessCode, ...result } = employees[i];
            results[i] = result;
        }
        
        return results;
    }

    async getManyCompleteResponses(cursor: number): Promise<Partial<Employee>[]> {
        
        prisma.$connect();

        let employees: Employee[];
        
        try {
            employees = await prisma.employee.findMany({
                where: {
                    submitted: true
                },
                orderBy: {
                    submitCount: "desc"
                },
                cursor: {
                    submitCount: cursor
                },
                take: 25
            })
        } catch(e) {
            return null;
        }

        let results = []
        for (let i in employees)
        {
            let { accessCode, ...result } = employees[i];
            results[i].formResponses.date = this.convertDate(results[i].formResponses.date);
            results[i] = result;
        }
        return results;
    }

    async updateEmployee(userId: number, data: Prisma.EmployeeUpdateInput): Promise<void> {

        prisma.$connect()
        // let mode: ROLES = await utils.checkAuthStatus(prisma, request);
        try {
            prisma.employee.update({
                where: {
                    userId: userId,
                },
                data: data
            })
        } catch (e) {
            throw new Error()
        }
    }

    async deleteEmployee(userId: number) {

        prisma.$connect();
        try {
            prisma.employee.delete({
                where: {
                    userId: userId
                }
            });
        } catch (e) {
            throw new Error()
        }
    }

    async createEmployee({firstName, lastName}: {firstName: string, lastName: string}) {

        let employee: Prisma.EmployeeCreateInput = {
            createId: await this.getLastCreateId(),
            userId: utils.makeId(9),
            firstName: firstName,
            lastName: lastName,
            username: lastName.toLowerCase() + firstName[0].toLowerCase() + utils.makeId(3),
            formResponses: {
                date: '',
                signatureId: ''
            },
            accessCode: utils.makeId(7).toString(),
            submitted: false,
            submitCount: 0
        }

        
        try {
            await prisma.employee.create({
                data: employee
            });
        } catch (e) {
            throw new Error()
        }
    }

    async getLastCreateId(): Promise<number> {
        try {
            let createId = (await prisma.employee.findMany({
                orderBy: {
                createId: "desc"
                },
                take: 1
            }))[0].createId++

            return createId
        } catch (e) {
            return 0;
        }
    }

    async getLastSubmitCount(): Promise<number> {
        try {
            let submitCount = (await prisma.employee.findMany({
                where: {
                  submitted: true
                },
                orderBy: {
                  submitCount: "desc"
                },
                take: 1
              }))[0].submitCount++
    
            return submitCount;
        } catch (e) {
            return 0;
        }
    }

}
