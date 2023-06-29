import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { PrismaService } from '@config/prisma.service';
import { ProductService } from '../product/product.service';
import { cartMock, productsOnCartsMock } from './mocks/cart.mock';
import { userMock } from '@user/mocks/user.mock';
import { productMock } from '@product/mocks/product.mock';
import { S3Service } from '@aws/s3.service';
import { CategoryService } from '@category/category.service';
import { createS3Mock } from '@mocks/s3.mock';

describe('CartService', () => {
    let service: CartService;
    let productService: ProductService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
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

        service = module.get<CartService>(CartService);
        productService = module.get<ProductService>(ProductService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should find user cart', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);
            prisma.cart.findFirstOrThrow.mockResolvedValueOnce(cartMock);

            // Act
            const result = await service.findOne(userMock.id);

            // Assert
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when cart does not exists', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);
            prisma.cart.findFirstOrThrow.mockRejectedValueOnce(null);

            // Act & assert
            await expect(service.findOne(userMock.id)).rejects.toThrow(
                'Cart not found'
            );
        });
    });

    describe('addProduct', () => {
        it('should add a new product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);
            prisma.cart.findFirstOrThrow
                .mockResolvedValueOnce(cartMock)
                .mockResolvedValueOnce(cartMock);
            prisma.productsOnCarts.upsert.mockResolvedValueOnce(
                productsOnCartsMock
            );

            // Act
            const result = await service.addProduct(1, {
                SKU: 1,
                quantity: 1,
            });

            // Assert
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when quantity exceedds current stock', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);

            // Act
            const quantity = 1000;
            const isAvailable = await productService.isAvailable(
                productMock.SKU,
                quantity
            );

            // Assert
            expect(isAvailable).toEqual(false);
            await expect(
                service.addProduct(userMock.id, {
                    SKU: 4,
                    quantity,
                })
            ).rejects.toThrow('Quantity exceeds current stock');
        });
    });

    describe('deleteProductOnCart', () => {
        it('should remove a product from cart', async () => {
            // Arrange
            prisma.cart.findFirstOrThrow
                .mockResolvedValueOnce(cartMock)
                .mockResolvedValueOnce({ ...cartMock, products: [] as any });
            prisma.productsOnCarts.findUniqueOrThrow.mockResolvedValueOnce(
                productsOnCartsMock
            );
            prisma.productsOnCarts.delete.mockResolvedValueOnce(
                productsOnCartsMock
            );

            // Act
            const result = await service.deleteProductOnCart(
                userMock.id,
                productsOnCartsMock.product.SKU
            );

            // Assert
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when remove a product from cart that does not exists', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);
            prisma.cart.findFirstOrThrow.mockRejectedValueOnce(null);

            // Act & Assert
            await expect(
                service.deleteProductOnCart(
                    userMock.id,
                    productsOnCartsMock.product.SKU
                )
            ).rejects.toThrow('Cart not found');
        });

        it('should fail when remove a product from cart when product does not exists', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);
            prisma.cart.findFirstOrThrow.mockResolvedValueOnce(cartMock);
            prisma.productsOnCarts.findUniqueOrThrow.mockRejectedValueOnce(
                null
            );

            // Act & Assert
            await expect(
                service.deleteProductOnCart(userMock.id, 1000)
            ).rejects.toThrow(`Product 1000 is not in this cart`);
        });
    });
});
