import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'admin/admin.module';
import { AdminService } from 'admin/admin.service';
import { EmployeeModule } from 'employee/employee.module';
import { EmployeeService } from 'employee/employee.service';
import { RolesGuard } from 'roles/roles.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';


@Module({
    imports: [
        EmployeeModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '30m' },
        }),
        AdminModule
      ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, EmployeeService, AdminService, JwtStrategy]
})
export class AuthModule {

}
