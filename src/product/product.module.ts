import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from '@config/prisma.service';
import { S3Service } from 'src/aws/s3.service';
import { AwsModule } from 'src/aws/aws.module';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from 'src/category/category.service';
import { ProductResolver } from './product.resolver';

@Module({
    imports: [AwsModule],
    providers: [
        ProductService,
        PrismaService,
        S3Service,
        ConfigService,
        CategoryService,
        ProductResolver,
    ],
})
export class ProductModule {}
