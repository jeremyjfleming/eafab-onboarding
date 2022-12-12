import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtResponse, ROLES } from 'lib/types';
import { Roles } from 'roles/roles.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Get("/user/signin")
    @UseGuards(LocalAuthGuard)
    async userLogin(@Request() request): Promise<JwtResponse> {
        if (request.user.role !== ROLES.USER)
            throw new UnauthorizedException();
        return this.authService.login(request.user);
    }

    @Get("/user/signout")
    async userLogout(): Promise<void> {
        
    }

    @Get("/admin/signin")
    async adminLogin(@Request() request): Promise<JwtResponse> {
        if (request.user.role !== ROLES.ADMIN)
            throw new UnauthorizedException();
        return this.authService.login(request.user);
    }
    
    @Get("/admin/signout")
    @UseGuards(LocalAuthGuard)
    async adminLogout(): Promise<void> {
        
    }

    @Get("user/status")
    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.USER)
    async getUserStatus(): Promise<void> {}

    @Get("admin/status")
    @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    async getAdminStatus(): Promise<void> {}

}
