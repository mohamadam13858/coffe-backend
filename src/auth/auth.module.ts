import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'}) ,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService] , 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      })
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService , JwtStrategy , RolesGuard],
  controllers: [AuthController],
  exports: [JwtStrategy ,PassportModule , RolesGuard]
})
export class AuthModule { }
