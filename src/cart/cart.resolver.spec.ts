import { Test, TestingModule } from '@nestjs/testing';
import { CartResolver } from './cart.resolver';
import { S3Service } from '@aws/s3.service';
import { CategoryService } from '@category/category.service';
import { PrismaService } from '@config/prisma.service';
import { createMockContext } from '@mocks/prisma.mock';
import { createS3Mock } from '@mocks/s3.mock';
import { ProductService } from '@product/product.service';
import { CartService } from './cart.service';

describe('CartResolver', () => {
    let resolver: CartResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartResolver,
                CartService,
                ProductService,
                PrismaService,
                S3Service,
                CategoryService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(S3Service)
            .useValue(createS3Mock())
            .compile();

        resolver = module.get<CartResolver>(CartResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
