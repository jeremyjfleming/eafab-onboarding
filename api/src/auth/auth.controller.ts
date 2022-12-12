import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtResponse, ROLES } from 'lib/types';
import { Roles } from 'roles/roles.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Get("/user/signin")
    @UseGuards(LocalAuthGuard)
    async userLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }

    @Get("/user/signout")
    async userLogout(): Promise<void> {
        
    }

    @Get("/admin/signin")
    async adminLogin(@Request() request): Promise<JwtResponse> {
        return this.authService.login(request.user);
    }
    
    @Get("/admin/signout")
    @UseGuards(LocalAuthGuard)
    async adminLogout(): Promise<void> {
        
    }

}
