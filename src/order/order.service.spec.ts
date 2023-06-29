import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { ProductService } from './../product/product.service';
import {
    allOrdersMock,
    orderMock,
    productsOnOrdersMock,
} from './mocks/order.mock';
import { CartService } from '@cart/cart.service';
import { cartMock, productsOnCartsMock } from '@cart/mocks/cart.mock';
import { productMock } from '@product/mocks/product.mock';
import { SesService } from '@aws/ses.service';
import { createSESMock } from '@mocks/ses.mock';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '@aws/s3.service';
import { createS3Mock } from '@mocks/s3.mock';
import { CategoryService } from '@category/category.service';
import { paginationMock } from '@mocks/pagination.mock';

describe('OrderService', () => {
    let service: OrderService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
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

        service = module.get<OrderService>(OrderService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should find one order', async () => {
            // Arrange
            prisma.order.findUniqueOrThrow.mockResolvedValueOnce(orderMock);

            // Act
            const result = await service.findOne({ id: orderMock.id });

            // Assert
            expect(result).toHaveProperty('id', expect.any(Number));
            expect(result.total).toBeGreaterThan(0);
        });

        it('should fail when order does not exists', async () => {
            // Arrange
            prisma.order.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & arrange
            await expect(service.findOne({ id: 1000 })).rejects.toThrow(
                'Order not found'
            );
        });
    });

    describe('findAll', () => {
        it('should find all orders', async () => {
            // Arrange
            prisma.order.findMany.mockResolvedValueOnce(allOrdersMock);

            // Act
            const result = await service.findAll(paginationMock);

            // Assert
            expect(result).toHaveLength(3);
        });
    });

    describe('placeOrder', () => {
        it('should place an order', async () => {
            // Arrange
            prisma.$transaction.mockImplementationOnce(async (callback) => {
                await callback(prisma);
                return orderMock;
            });
            prisma.cart.findFirstOrThrow.mockResolvedValue(cartMock);
            prisma.productsOnCarts.findMany.mockResolvedValue([]);
            prisma.user.findMany.mockResolvedValueOnce([]);
            prisma.order.create.mockResolvedValueOnce(orderMock);
            prisma.product.update.mockResolvedValue(productMock);
            prisma.productsOnOrders.create.mockResolvedValueOnce(
                productsOnOrdersMock
            );
            prisma.productsOnCarts.delete.mockResolvedValueOnce(
                productsOnCartsMock
            );
            prisma.order.update.mockResolvedValueOnce(orderMock);

            // Act
            const result = await service.placeOrder(1);

            // Assert
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(prisma.cart.findFirstOrThrow).toHaveBeenCalledTimes(1);
            expect(prisma.product.update).toHaveBeenCalledTimes(1);
            expect(prisma.productsOnCarts.delete).toHaveBeenCalledTimes(1);
            expect(result).toMatchObject(orderMock);
        });

        it('should fail when place order when cart does not exists', async () => {
            // Arrange
            prisma.$transaction.mockImplementationOnce(async (callback) => {
                await callback(prisma);
                return orderMock;
            });
            prisma.cart.findFirstOrThrow.mockRejectedValueOnce(null);

            // Act & Assert

            // Assert
            await expect(service.placeOrder(1)).rejects.toThrow(
                'Cart not found'
            );
        });
    });
});
