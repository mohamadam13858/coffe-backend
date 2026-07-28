import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRoleDto } from './dto/update-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './entities/user.entity';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Get()
    @Roles('admin')
    getAllUsers(@Query() filterDto: GetUserFilterDto): Promise<{
        data: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        return this.usersService.getAllUsers(filterDto)
    }

    @Get(':id')
    @Roles('admin')
    getUser(@Param('id') id: string): Promise<UserResponseDto> {
        return this.usersService.getUser(id)
    }


    @Get('me')
    getMe(@GetUser() user: User) {
        return this.usersService.getMe(user.id);
    }


    @Patch(':id/role')
    @Roles('admin')
    changeUserRole(@Param('id') id: string, @Body() userRoleDto: UserRoleDto, @GetUser() user: User): Promise<UserResponseDto> {
        return this.usersService.changeUserRole(id, userRoleDto, user)
    }


    @Patch(':id/block')
    @Roles('admin')
    blockUser(@Param('id') id: string, @Body() blockUserDto: BlockUserDto, @GetUser() user: User): Promise<UserResponseDto> {
        return this.usersService.blockUser(id, blockUserDto, user)
    }


    @Patch('me')
    updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
        return this.usersService.updateProfile(user.id, updateProfileDto)
    }

    @Delete(':id')
    @Roles('admin')
    removeUser(
        @Param('id') id: string,
        @GetUser() currentUser: User,
    ) {
        return this.usersService.removeUser(id, currentUser);
    }

}
