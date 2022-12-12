import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeGateway } from './employee/employee.gateway';
import { EmployeeService } from './employee/employee.service';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RolesGuard } from 'roles/roles.guard';

@Module({
  imports: [EmployeeModule, AuthModule, AdminModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AppModule {}