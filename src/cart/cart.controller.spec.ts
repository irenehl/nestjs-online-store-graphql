import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { addProductToCartMock, cartMock } from './mocks/cart.mock';
import { userPayloadMock } from '@user/mocks/user.mock';
import { PrismaService } from '@config/prisma.service';
import { CartService } from './cart.service';

describe('CartController', () => {
    let controller: CartController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CartService,
                    useValue: {
                        findOne: jest.fn(() => ({
                            cartMock,
                        })),
                        addProduct: jest.fn(() => ({
                            cartMock,
                        })),
                        deleteProductOnCart: jest.fn(() => ({
                            cartMock,
                        })),
                    },
                },
                PrismaService,
            ],
            controllers: [CartController],
        }).compile();

        controller = module.get<CartController>(CartController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOne', () => {
        it('should findOne method be defined', async () => {
            expect(await controller.findOne(userPayloadMock)).toBeDefined();
        });
    });

    describe('addProduct', () => {
        it('should addProduct method be defined', async () => {
            const result = await controller.addProduct(
                userPayloadMock,
                addProductToCartMock
            );

            expect(result).toBeDefined();
        });
    });

    describe('deleteProductOnCart', () => {
        it('should deleteProductOnCart method be defined', async () => {
            expect(await controller.deleteProductOnCart(userPayloadMock, '1'));
        });
    });
});
