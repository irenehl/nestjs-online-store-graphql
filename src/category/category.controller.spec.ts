import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { PrismaService } from '@config/prisma.service';
import { CategoryService } from './category.service';
import { allCategoryMock, categoryMock } from './mocks/category.mock';
import { CategoryDto } from './dtos/category.dto';

describe('CategoryController', () => {
    let controller: CategoryController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CategoryService,
                    useValue: {
                        create: jest.fn(() => ({
                            categoryMock,
                        })),
                        findOne: jest.fn(() => ({
                            categoryMock,
                        })),
                        findAll: jest.fn(() => ({
                            allCategoryMock,
                        })),
                        update: jest.fn(() => ({
                            categoryMock,
                        })),
                        delete: jest.fn(() => ({
                            categoryMock,
                        })),
                    },
                },
                PrismaService,
            ],
            controllers: [CategoryController],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should created category method be defined', async () => {
            const category: CategoryDto = {
                id: 1,
                name: 'CATEGORY_01',
            };

            expect(await controller.create(category)).toBeDefined();
        });
    });

    describe('findOne', () => {
        it('should findOne category method be defined', async () => {
            expect(await controller.findOne('1')).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should findAll category method be defined', async () => {
            expect(await controller.findAll('1', '15')).toBeDefined();
        });
    });

    describe('update', () => {
        it('should update category method be defined', async () => {
            const category: CategoryDto = {
                id: 1,
                name: 'CATEGORY_01',
            };

            expect(await controller.update('1', category)).toBeDefined();
        });
    });

    describe('delete', () => {
        it('should delete category method be defined', async () => {
            expect(await controller.delete('1')).toBeDefined();
        });
    });
});
