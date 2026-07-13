import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { Role } from './role.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }


    async register(registerDto: RegisterDto): Promise<void> {
        const { firstName, lastName, mobile, email, role, password } = registerDto
        const existingUser = await this.userRepository.findOne({ where: { mobile } })
        if (existingUser) {
            throw new ConflictException('این شماره موبایل قبلا ثبت شده است')
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = this.userRepository.create({
            mobile,
            email,
            firstName,
            lastName,
            role: role || Role.CUSTOMER,
            password: hashedPassword
        })

        try {

            await this.userRepository.save(user)

        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                console.log(error)
                throw new InternalServerErrorException()
            }
        }
    }
}
