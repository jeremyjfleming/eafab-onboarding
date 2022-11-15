import { Controller, Get, HttpException, HttpStatus, Req } from '@nestjs/common';
import * as utils from "src/lib/utils"
import type { Employee } from "src/lib/types"
import { ROLES } from 'src/lib/types';

@Controller('employee')
export class EmployeeController {

    @Get("/eafab/employee")
    getEmployee(@Req() request: Request): Employee {

    }
}