import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '@user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@config/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AwsModule } from '@aws/aws.module';
import { SesService } from '@aws/ses.service';
import { AuthResolver } from './auth.resolver';

@Module({
    imports: [
        AwsModule,
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    providers: [
        AuthService,
        UserService,
        ConfigService,
        PrismaService,
        JwtService,
        JwtStrategy,
        SesService,
        AuthResolver,
    ],
})
export class AuthModule {}
