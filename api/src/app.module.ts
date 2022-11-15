import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeController } from './employee/employee.controller';
import { SigninController } from './signin/signin.controller';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [],
  controllers: [AppController, EmployeeController, SigninController, AdminController],
  providers: [AppService],
})
export class AppModule {}
