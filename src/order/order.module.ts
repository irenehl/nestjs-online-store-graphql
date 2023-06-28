import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '@config/prisma.service';
import { ProductService } from '@product/product.service';
import { CartService } from '@cart/cart.service';
import { AwsModule } from 'src/aws/aws.module';
import { CategoryService } from 'src/category/category.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/aws/s3.service';
import { SesService } from '@aws/ses.service';
import { OrderResolver } from './order.resolver';

@Module({
    imports: [AwsModule],
    providers: [
        OrderService,
        PrismaService,
        ProductService,
        CartService,
        CategoryService,
        ConfigService,
        S3Service,
        SesService,
        OrderResolver,
    ],
    controllers: [OrderController],
})
export class OrderModule {}
