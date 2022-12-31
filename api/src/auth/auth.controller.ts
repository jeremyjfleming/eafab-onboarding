import { Controller, Get, UseGuards, Request, UnauthorizedException, Post } from '@nestjs/common';
import { JwtResponse, ROLES } from 'lib/types';
import { Roles } from 'roles/roles.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("/user/signin")
    @UseGuards(LocalAuthGuard)
    @Roles(ROLES.USER)
    async userLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }

    @Post("/user/signout")
    async userLogout(): Promise<void> {
        
    }

    @Post("/admin/signin")
    @UseGuards(LocalAuthGuard)
    @Roles(ROLES.ADMIN)
    async adminLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }
    
    @Post("/admin/signout")
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
