import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRoleDto } from './dto/update-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from './enums/role.enum';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { PaginatedResponse } from 'src/common/interface/paginated-response.interface';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }


    async getAllUsers(filterDto: GetUserFilterDto): Promise<PaginatedResponse<UserResponseDto>> {
        const { search, role, isActive, page = 1, limit = 10 } = filterDto
        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const query = this.userRepository.createQueryBuilder('user')

        if (search?.trim()) {
            const normalizedSearch = `%${search.trim()}%`
            query.andWhere(
                new Brackets((qb) => {
                    qb.where('user.mobile ILIKE :search', { search: normalizedSearch })
                        .orWhere('user.firstName ILIKE :search', { search: normalizedSearch })
                        .orWhere('user.lastName ILIKE :search', { search: normalizedSearch })
                        .orWhere('user.email ILIKE :search', { search: normalizedSearch });
                }),
            );
        }


        if (role) {
            query.andWhere(`user.role = :role`, { role })
        }


        if (typeof isActive === 'boolean') {
            query.andWhere('user.isActive = :isActive', { isActive });
        }


        query.orderBy('user.createdAt', 'DESC').addOrderBy('user.id', 'DESC').skip((pageNumber - 1) * limitNumber).take(limitNumber)
        const [users, total] = await query.getManyAndCount()

        return {
            data: plainToInstance(UserResponseDto, users, {
                excludeExtraneousValues: true
            }),
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }


    async getUser(id: string): Promise<UserResponseDto> {
        const user = await this.findUserOrFail(id)

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
        const user = await this.findUserOrFail(id)

        user.role = role
        const savedUser = await this.userRepository.save(user)

        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        })


    }



    async changeStatus(id: string, blockUserDto: BlockUserDto, currentUser: User): Promise<UserResponseDto> {
        if (id === currentUser.id) {
            throw new BadRequestException('نمی توانید وضعیت خود را تغییر بدهید')
        }

        const user = await this.findUserOrFail(id)

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

        const user = await this.findUserOrFail(id)

        await this.userRepository.softRemove(user)

        return { message: 'کاربر با موفقیت حذف شد' }
    }


    private async findUserOrFail(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('کاربر پیدا نشد');
        return user;
    }


}