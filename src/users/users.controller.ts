import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user.response.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Get()
    @Roles('admin')
    getAllUsers(): Promise<UserResponseDto[]> {
        return this.usersService.getAllUsers()
    }

    @Get(':id')
    @Roles('admin')
    getUser(@Param('id') id: string): Promise<UserResponseDto> {
        return this.usersService.getUser(id)
    }

}
