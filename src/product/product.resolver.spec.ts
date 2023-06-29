import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { PrismaService } from '@config/prisma.service';
import { S3Service } from '@aws/s3.service';
import { CategoryService } from '@category/category.service';
import { ConfigService } from '@nestjs/config';
import { ProductService } from './product.service';
import { createMockContext } from '@mocks/prisma.mock';
import { createS3Mock } from '@mocks/s3.mock';

describe('ProductResolver', () => {
    let resolver: ProductResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductResolver,
                ProductService,
                PrismaService,
                ConfigService,
                S3Service,
                CategoryService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(S3Service)
            .useValue(createS3Mock())
            .compile();

        resolver = module.get<ProductResolver>(ProductResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
