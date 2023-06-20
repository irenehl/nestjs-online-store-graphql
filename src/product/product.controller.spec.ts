import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '@config/prisma.service';
import { allProductsMock, productMock } from './mocks/product.mock';

describe('ProductController', () => {
    let controller: ProductController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        create: jest.fn(() => ({
                            productMock,
                        })),
                        findOne: jest.fn(() => ({
                            productMock,
                        })),
                        findAll: jest.fn(() => ({
                            allProductsMock,
                        })),
                        update: jest.fn(() => ({
                            productMock,
                        })),
                        toggle: jest.fn(() => ({
                            productMock,
                        })),
                        delete: jest.fn(() => ({
                            productMock,
                        })),
                        getProductByCategory: jest.fn(() => ({
                            allProductsMock,
                        })),
                        likeProduct: jest.fn(() => ({
                            productMock,
                        })),
                    },
                },
                PrismaService,
            ],
            controllers: [ProductController],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should created product method be defined', async () => {
            expect(await controller.create(productMock)).toBeDefined();
        });
    });

    describe('findOne', () => {
        it('should findOned product method be defined', async () => {
            expect(await controller.findOne('1')).toBeDefined();
        });
    });

    describe('getProductsByCategory', () => {
        it('should getProductsByCategoryd product method be defined', async () => {
            expect(await controller.getProductByCategory('1')).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should findAlld product method be defined', async () => {
            expect(await controller.findAll('1', '15')).toBeDefined();
        });
    });

    describe('update', () => {
        it('should updated product method be defined', async () => {
            expect(await controller.update({ price: 10 }, '1')).toBeDefined();
        });
    });

    describe('toggle', () => {
        it('should toggled product method be defined', async () => {
            expect(await controller.toggle('1')).toBeDefined();
        });
    });

    describe('likeProduct', () => {
        it('should likeProductd product method be defined', async () => {
            const userId: any = '1';

            return expect(
                await controller.likeProduct('1', userId)
            ).toBeDefined();
        });
    });

    describe('delete', () => {
        it('should deleted product method be defined', async () => {
            expect(await controller.delete('1')).toBeDefined();
        });
    });
});
