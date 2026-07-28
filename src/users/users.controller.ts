import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRoleDto } from './dto/update-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';

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

    @Patch(':id')
    @Roles('admin')
    changeUserRole(@Param('id') id : string , @Body() userRoleDto: UserRoleDto): Promise<UserResponseDto>{
      return this.usersService.changeUserRole(id , userRoleDto)
    }


    @Patch(':id')
    @Roles('admin')
    blockUser(@Param('id') id: string , @Body() blockUserDto : BlockUserDto): Promise<UserResponseDto>{
        return this.usersService.blockUser(id , blockUserDto)
    }

}
