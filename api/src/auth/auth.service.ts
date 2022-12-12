import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, Employee, Prisma } from '@prisma/client';
import { AdminService } from 'admin/admin.service';
import { EmployeeService } from 'employee/employee.service';
import { JwtResponse, ROLES } from 'lib/types';
import { Roles } from 'roles/roles.decorator';
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<Partial<Employee | Admin>> {
    const user = await this.employeeService.getOneEmployee({username});
    if (user && user.accessCode === password) {
      const { accessCode, ...result } = user;
      return result;
    }
    const admin = await this.adminService.getOneAdmin(username);
    if (admin) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      if (await bcrypt.compare(password, hash)) {
        const { password, ...result } = admin;
        return result
      }
    }
    return null;
  }

  async getUserType(username: string): Promise<ROLES> {
    const user = await this.employeeService.getOneEmployee({username});
    if (user) {
      return ROLES.USER
    }
    const admin = await this.adminService.getOneAdmin(username);
    if (admin)
      return ROLES.ADMIN
    return null
  }

  async login(user: any): Promise<JwtResponse> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
