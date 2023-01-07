import { Controller, Get, UseGuards, Request, UnauthorizedException, Post } from '@nestjs/common';
import { JwtResponse, ROLES } from 'lib/types';
import { Roles } from 'roles/roles.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from 'roles/roles.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("/user/signin")
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(ROLES.USER)
    async userLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }


    @Post("/admin/signin")
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    async adminLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }
    
    @Get("user/status")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.USER)
    async getUserStatus(): Promise<void> {}

    @Get("admin/status")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.ADMIN)
    async getAdminStatus(): Promise<void> {}

}
