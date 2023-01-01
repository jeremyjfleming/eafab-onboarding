import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'roles/roles.guard';

@Module({
  imports: [EmployeeModule, AuthModule, AdminModule],
})
export class AppModule {}