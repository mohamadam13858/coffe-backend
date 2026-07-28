import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRoleDto } from './dto/update-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from './enums/role.enum';
import { GetUserFilterDto } from './dto/get-user-fileter.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }


    async getAllUsers(filterDto: GetUserFilterDto) {
        const { search, role, isActive, page = 1, limit = 10 } = filterDto
        const query = this.userRepository.createQueryBuilder('user')

        if (search) {
            query.andWhere(
                `(user.mobile ILIKE :search
        OR user.firstName ILIKE :search
        OR user.lastName ILIKE :search
        OR user.email ILIKE :search)`,
                { search: `%${search}%` },
            );
        }


        if (role) {
            query.andWhere(`user.role = :role` , {role})
        }


        if (isActive !== undefined) {
             query.andWhere(`user.isActive = :isActive` , {isActive})
        }


        query.orderBy('user.createdAt' , 'DESC').skip((page - 1) * limit).take(limit)
        const [users , total] = await query.getManyAndCount()

        return {
            data: plainToInstance(UserResponseDto , users , {
                excludeExtraneousValues: true
            })
            total , 
            page , 
            limit , 
            totalPages: Math.ceil(total / limit)
        }
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


    async getMe(userId: string): Promise<UserResponseDto> {
        return this.getUser(userId)
    }


    async changeUserRole(id: string, changeUserRoleDto: UserRoleDto, currentUser: User): Promise<UserResponseDto> {
        if (id === currentUser.id) {
            throw new BadRequestException('نمی توانید نقش خود را تغییر بدهید')
        }
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



    async blockUser(id: string, blockUserDto: BlockUserDto, currentUser: User): Promise<UserResponseDto> {
        if (id === currentUser.id) {
            throw new BadRequestException('نمی توانید وضعیت خود را تغییر بدهید')
        }
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('کاربر با این شناسه یافت نشد ')
        }

        if (user.role === Role.ADMIN && currentUser.role === Role.ADMIN) {
            throw new BadRequestException('نمی توانید وضعیت ادمین را تغییر دهید')
        }

        user.isActive = blockUserDto.isActive
        const savedUser = await this.userRepository.save(user)

        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        })
    }


    async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {

        const user = await this.userRepository.preload({
            id,
            ...updateProfileDto
        })

        if (!user) {
            throw new NotFoundException('کاربر یافت نشد')
        }


        const savedUser = await this.userRepository.save(user)


        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        })


    }


    async removeUser(id: string, currentUser: User): Promise<{ message: string }> {
        if (id === currentUser.id) {
            throw new BadRequestException('نمی توانید خودتان را حذف کنید')
        }

        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException('کاربر یافت نشد')
        }

        await this.userRepository.softRemove(user)

        return { message: 'کاربر با موفقیت حذف شد' }
    }


}