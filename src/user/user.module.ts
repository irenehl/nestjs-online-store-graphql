import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@aws/ses.service';
import { AwsModule } from '@aws/aws.module';

@Module({
    imports: [AwsModule],
    providers: [UserService, PrismaService, ConfigService, SesService],
    controllers: [UserController],
})
export class UserModule {}
