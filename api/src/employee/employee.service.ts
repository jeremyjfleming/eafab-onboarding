import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { Prisma, PrismaClient, Employee } from '@prisma/client';
import { LocalAuthGuard } from 'auth/local-auth.guard';
import { CreateEmployeeDTO, SectionResponseDTO } from 'lib/dtos';
import * as utils from 'lib/utils';
import { DateTime } from "luxon"


let prisma = new PrismaClient()

@Injectable()
export class EmployeeService {
    
    async getOneEmployee(obj: {userId?: number; username?: string}): Promise<Partial<Employee>> {
        
        
        // utils.checkAuthStatus(prisma, request);

        let employee: Employee

        try {
            employee = await prisma.employee.findUnique({
                where: obj
            })
        } catch (e) {
            console.log(e)
            return null;
        }


        if (employee == null)
            return employee;

        employee.formResponses.date = this.convertDate(employee.formResponses.date);
        let { id, ...result } = employee
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
                    createId: await this.getLastCreateId()-1 - cursor
               },
               take: 25
            })
        } catch (e) {
            return null;
        }
        
        return employees;
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
                    submitCount: await this.getLastSubmitCount(false)-1 - cursor
                },
                take: 25
            })
        } catch(e) {
            return null;
        }

        for (let i in employees)
        {
            employees[i].formResponses.date = this.convertDate(employees[i].formResponses.date);
        }
        return employees;
    }

    async updateEmployee(userId: number, data: Prisma.EmployeeUpdateInput): Promise<void> {

        let employee = (await prisma.employee.findUnique({
          where: {
            userId: userId
          }
        }))


        if (data.submitted === true) {
          // verify all form data is complete


    
            for (let i in employee.formResponses.sectionResponses) {
                for (let entry in employee.formResponses.sectionResponses[i]) {
                    if (employee.formResponses.sectionResponses[entry] == "")
                        throw new NotAcceptableException({ error: "All form data not complete"})
                    }
            }

            if (employee.formResponses.signatureId == "")
                throw new NotAcceptableException({ error: "All form data not complete"})
    
            let date = DateTime.now().toISO();
            let submitCount = await this.getLastSubmitCount(false);
            data.submitCount = submitCount;
            data.formResponses.date = date;
        
        } else if (Math.sign(employee.submitCount) == -1) {
            data.submitCount = employee.submitCount *-1;
        }
        


        if (data.hasOwnProperty("formResponses") && !data.formResponses.hasOwnProperty("date")) // bug with this prisma type where it wants a date property in every case. 
            data.formResponses.date = "";
        try {
            await prisma.employee.update({
                where: {
                    userId: userId,
                },
                data: data
            })
        } catch (e) {
            throw new Error(e)
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


        let employee: Prisma.EmployeeCreateInput
        try {
            employee = {
                createId: await this.getLastCreateId(),
                userId: utils.makeId(9),
                firstName: firstName,
                lastName: lastName,
                username: lastName.toLowerCase() + firstName[0].toLowerCase() + utils.makeId(3),
                formResponses: {
                    date: '',
                    signatureId: '',
                    sectionResponses: new Array(24).fill({questionOne: "", questionTwo: "", questionThree: "", summary: ""})
                },
                accessCode: utils.makeId(7).toString(),
                submitted: false,
                submitCount: await this.getLastSubmitCount(true)
            }
        } catch (e) {
            console.log(e)
            throw new Error()
        }

        
        try {
            await prisma.employee.create({
                data: employee
            });
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async getLastCreateId(): Promise<number> {
        try {
            let employee = (await prisma.employee.findMany({
                orderBy: {
                 createId: "desc"
                },
                take: 1
            }))[0]
            let createId = employee.createId+1
            return createId
        } catch (e) {
            return 0
        }
    }

    async getLastSubmitCount(reverse: boolean): Promise<number> {
        try {
            let employee = (await prisma.employee.findMany({
                orderBy: {
                  submitCount: reverse ? "asc" : "desc"
                },
                take: 1
              }))[0]

              let submitCount = reverse ? employee.submitCount-1 : employee.submitCount+1
              return submitCount;
              
            } catch (e) {
                return 0;
        }
    }

}
