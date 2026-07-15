import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('signup')
    signup(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto)
    }


    @Post('signin')
    signin(@Body() loginDto: LoginDto): Promise<{accessToken: string}> {
      return this.authService.login(loginDto)
    }

}
