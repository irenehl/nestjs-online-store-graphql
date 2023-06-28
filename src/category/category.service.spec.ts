import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { allCategoryMock, categoryMock } from './mocks/category.mock';
import { paginationMock } from '@mocks/pagination.mock';

describe('CategoryService', () => {
    let service: CategoryService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        service = module.get<CategoryService>(CategoryService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new category', async () => {
            // Arrange
            prisma.category.findUnique.mockResolvedValueOnce(null);
            prisma.category.create.mockResolvedValueOnce(categoryMock);

            // Act
            const result = await service.create({
                name: 'CATEGORY_01',
            });

            // Assert
            expect(prisma.category.create).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when category already exits', async () => {
            // Arrange
            prisma.category.findUnique.mockResolvedValueOnce(categoryMock);

            // Act & Assert
            await expect(
                service.create({
                    name: 'CATEGORY_01',
                })
            ).rejects.toThrow('Category CATEGORY_01 already exists');
        });
    });

    describe('findOne', () => {
        it('should find one category', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockResolvedValue(categoryMock);

            // Act
            const result = await service.findOne({ id: 1 });

            // Assert
            expect(result).toMatchObject(categoryMock);
            expect(prisma.category.findFirstOrThrow).toHaveBeenCalled();
        });

        it('should fail when category does not exists', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockRejectedValue(categoryMock);

            // Act & Assert
            await expect(
                service.findOne({
                    id: 1,
                })
            ).rejects.toThrow('Category not found');
        });
    });

    describe('findAll', () => {
        it('should find all categories', async () => {
            // Arrange
            prisma.category.findMany.mockResolvedValueOnce(allCategoryMock);

            // Act
            const result = await service.findAll(paginationMock);

            // Assert
            expect(result).toHaveLength(3);
            expect(prisma.category.findMany).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockResolvedValue(categoryMock);
            prisma.category.update.mockResolvedValueOnce({
                ...categoryMock,
                name: 'UPDATED CATEGORY',
            });

            // Act
            const data = {
                name: 'UPDATED CATEGORY',
            };

            const result = await service.update({ id: categoryMock.id }, data);

            // Assert
            expect(result.name).toEqual('UPDATED CATEGORY');
            expect(prisma.category.update).toHaveBeenCalled();
        });

        it('should fail when update category that does not exists', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockRejectedValue(categoryMock);

            // Act
            const data = {
                name: 'UPDATED CATEGORY',
            };

            // Assert
            await expect(
                service.update(
                    {
                        id: 1,
                    },
                    data
                )
            ).rejects.toThrow('Category not found');
        });
    });

    describe('delete', () => {
        it('should delete a category', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockResolvedValue(categoryMock);
            prisma.category.delete.mockResolvedValueOnce(categoryMock);

            // Act
            const result = await service.delete({ id: categoryMock.id });

            // Assert
            expect(prisma.category.delete).toHaveBeenCalled();
            expect(result.id).toEqual(categoryMock.id);
        });

        it('should fail when delete category that does not exists', async () => {
            // Arrange
            prisma.category.findFirstOrThrow.mockRejectedValue(categoryMock);

            // Act & Assert
            await expect(
                service.delete({
                    id: 1,
                })
            ).rejects.toThrow('Category not found');
        });
    });
});
