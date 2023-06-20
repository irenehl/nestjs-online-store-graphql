import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { allOrdersMock, orderMock } from './mocks/order.mock';
import { userPayloadMock } from '@user/mocks/user.mock';

describe('OrderController', () => {
    let controller: OrderController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: OrderService,
                    useValue: {
                        findOne: jest.fn(() => ({
                            orderMock,
                        })),
                        findAll: jest.fn(() => ({
                            allOrdersMock,
                        })),
                        placeOrder: jest.fn(() => ({
                            orderMock,
                        })),
                    },
                },
            ],
            controllers: [OrderController],
        }).compile();

        controller = module.get<OrderController>(OrderController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOne', () => {
        it('should findOne method to be defined', async () => {
            expect(await controller.findOne('1'));
        });
    });

    describe('findAll', () => {
        it('should findAll method to be defined', async () => {
            expect(await controller.findAll('1', '15'));
        });
    });

    describe('create', () => {
        it('should create method to be defined', async () => {
            expect(await controller.placeOrder(userPayloadMock));
        });
    });
});
