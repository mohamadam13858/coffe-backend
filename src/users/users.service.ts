import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRoleDto } from './dto/update-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }


    async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({
            where: { isActive: true },
        })

        return plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        })
    }


    async getUser(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException('کاربر با این شناسه پیدا نشد')
        }

        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true
        })
    }


    async changeUserRole(id: string, changeUserRoleDto: UserRoleDto): Promise<UserResponseDto> {
        const { role } = changeUserRoleDto
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('کاربر با این شناسه پیدا نشد')
        }

        user.role = role
        const savedUser = await this.userRepository.save(user)

        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        })


    }



    async blockUser(id: string, blockUserDto: BlockUserDto): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('کاربر با این شناسه یافت نشد ')
        }

        user.isActive = blockUserDto.isActive
        const savedUser = await this.userRepository.save(user)

        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        })
    }


}