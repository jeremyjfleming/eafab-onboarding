import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeController } from './employee/employee.controller';
import { SigninController } from './signin/signin.controller';
import { AdminController } from './admin/admin.controller';
import { SignoutController } from './signout/signout.controller';
import { EmployeeGateway } from './employee/employee.gateway';

@Module({
  imports: [],
  controllers: [AppController, EmployeeController, SigninController, AdminController, SignoutController],
  providers: [AppService, EmployeeGateway],
})
export class AppModule {}