import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, Employee, Prisma } from '@prisma/client';
import { AdminService } from 'admin/admin.service';
import { EmployeeService } from 'employee/employee.service';
import { JwtResponse, ROLES } from 'lib/types';
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<Partial<(Employee | Admin) & { role: ROLES }>> {
    console.log("hit")
    const user = await this.employeeService.getOneEmployee({username});
    if (user && user.accessCode === password) {
      const { accessCode, ...result} = user;
      let final: Partial<Employee & { role: ROLES }> = result;
      final.role = ROLES.USER;
      if (user.submitted)
        return null;
      return final;
    }
    const admin = await this.adminService.getOneAdmin(username);
    if (admin) {
      if (await bcrypt.compare(password, admin.password)) {
        const { password, ...result } = admin;
        let final: Partial<Admin & { role: ROLES }> = result;
        final.role = ROLES.ADMIN;
        return final;
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
      user: user.userId
    };
  }
}
