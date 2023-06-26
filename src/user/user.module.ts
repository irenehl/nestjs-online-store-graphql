import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@aws/ses.service';
import { AwsModule } from '@aws/aws.module';
import { UserResolver } from './user.resolver';

@Module({
    imports: [AwsModule],
    providers: [
        UserService,
        PrismaService,
        ConfigService,
        SesService,
        UserResolver,
    ],
})
export class UserModule {}
