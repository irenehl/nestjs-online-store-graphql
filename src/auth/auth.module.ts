import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '@user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@config/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AwsModule } from '@aws/aws.module';
import { SesService } from '@aws/ses.service';

@Module({
    imports: [
        AwsModule,
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        UserService,
        ConfigService,
        PrismaService,
        JwtService,
        JwtStrategy,
        SesService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
