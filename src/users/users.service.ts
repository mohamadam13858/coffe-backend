import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user.response.dto';

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

        return plainToInstance(UserResponseDto , users , {
            excludeExtraneousValues: true
        })
    }


    async getUser(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({where : {id}})
        if (!user) {
            throw new NotFoundException('کاربر با این شناسه پیدا نشد')
        }

        return plainToInstance(UserResponseDto , user , {
            excludeExtraneousValues: true
        })
    }
}
