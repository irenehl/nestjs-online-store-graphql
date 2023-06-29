import { Test, TestingModule } from '@nestjs/testing';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { PrismaService } from '@config/prisma.service';
import { createMockContext } from '@mocks/prisma.mock';

describe('CategoryResolver', () => {
    let resolver: CategoryResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryResolver, CategoryService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        resolver = module.get<CategoryResolver>(CategoryResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
