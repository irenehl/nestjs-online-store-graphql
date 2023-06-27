import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '@config/prisma.service';
import { ProductService } from '@product/product.service';
import { AwsModule } from 'src/aws/aws.module';
import { S3Service } from 'src/aws/s3.service';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from 'src/category/category.service';
import { CartResolver } from './cart.resolver';

@Module({
    imports: [AwsModule],
    providers: [
        CartService,
        PrismaService,
        ProductService,
        S3Service,
        ConfigService,
        CategoryService,
        CartResolver,
    ],
    controllers: [CartController],
})
export class CartModule {}
