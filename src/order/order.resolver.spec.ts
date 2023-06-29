import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { S3Service } from '@aws/s3.service';
import { SesService } from '@aws/ses.service';
import { CartService } from '@cart/cart.service';
import { CategoryService } from '@category/category.service';
import { PrismaService } from '@config/prisma.service';
import { createMockContext } from '@mocks/prisma.mock';
import { createS3Mock } from '@mocks/s3.mock';
import { createSESMock } from '@mocks/ses.mock';
import { ConfigService } from '@nestjs/config';
import { ProductService } from '@product/product.service';
import { OrderService } from './order.service';

describe('OrderResolver', () => {
    let resolver: OrderResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderResolver,
                OrderService,
                PrismaService,
                ProductService,
                CartService,
                SesService,
                ConfigService,
                S3Service,
                CategoryService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(S3Service)
            .useValue(createS3Mock())
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        resolver = module.get<OrderResolver>(OrderResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
