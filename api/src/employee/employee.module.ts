import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeGateway } from './employee.gateway';
import { EmployeeService } from './employee.service';

@Module({
    controllers: [EmployeeController],
    providers: [EmployeeService, EmployeeGateway],
})
export class EmployeeModule {}
