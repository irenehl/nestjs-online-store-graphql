import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import {
    allProductsMock,
    likesOnProductsMock,
    productMock,
} from './mocks/product.mock';
import { S3MockContext, createS3Mock } from '@mocks/s3.mock';
import { S3Service } from '@aws/s3.service';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from '@category/category.service';
import { paginationMock } from '@mocks/pagination.mock';

describe('ProductService', () => {
    let service: ProductService;
    let prisma: MockContext;
    let s3: S3MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
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

        service = module.get<ProductService>(ProductService);
        prisma = module.get<MockContext>(PrismaService);
        s3 = module.get<S3MockContext>(S3Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new product', async () => {
            // Arrange
            prisma.product.findUnique.mockResolvedValueOnce(null);
            prisma.category.findFirstOrThrow.mockResolvedValueOnce({
                id: 1,
                name: '1',
            });
            prisma.product.create.mockResolvedValue(productMock);
            s3.generatePresignedUrl.mockResolvedValueOnce({
                uploadUrl: 'https://www.google.com',
                key: 'key',
            });

            // Act
            const result = await service.create({
                name: 'P2',
                description: 'lorem ipsum',
                price: 12.3,
                stock: 3,
                categoryId: 1,
            });

            // Assert
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });

        it('should fail when creating a product that already exists', async () => {
            // Arrange
            prisma.product.findUnique.mockResolvedValueOnce(productMock);

            // Act & Assert
            await expect(
                service.create({
                    name: 'P2',
                    description: 'lorem ipsum',
                    price: 12.3,
                    stock: 3,
                    categoryId: 1,
                })
            ).rejects.toThrow('Product already exists');
        });
    });

    describe('findOne', () => {
        it('should find one product by sku', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);

            // Act
            const result = await service.findOne({ SKU: productMock.SKU });

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });

        it('should fail when product does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & Arrange
            await expect(service.findOne({ SKU: 100 })).rejects.toThrow(
                'Product 100 not found'
            );
        });
    });

    describe('findAll', () => {
        it('should find all products', async () => {
            // Arrange
            prisma.product.findMany.mockResolvedValue(allProductsMock);

            // Act
            const result = await service.findAll(paginationMock);

            // Assert
            expect(result).toHaveLength(3);
            expect(prisma.product.findMany).toHaveBeenCalled();
        });
    });

    describe('getProductByCategory', () => {
        it('should find a product by category', async () => {
            // Arrange
            prisma.product.findMany.mockResolvedValueOnce(allProductsMock);

            // Act
            const result = await service.getProductByCategory(
                1,
                paginationMock
            );

            // Assert
            expect(result).toHaveLength(3);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.product.update.mockResolvedValue({
                ...productMock,
                name: 'updated product',
            });
            s3.generatePresignedUrl.mockResolvedValueOnce({
                uploadUrl: 'https://www.google.com',
                key: 'key',
            });

            // Act
            const result = await service.update(productMock.SKU, {
                name: 'updated product ',
                SKU: 1,
            });

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result.name).toEqual('updated product');
        });

        it('should fail when updated a product that does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & assert
            await expect(
                service.update(1000, {
                    name: 'updated product',
                    SKU: 1,
                })
            ).rejects.toThrow('Product 1000 not found');
        });
    });

    describe('toggle', () => {
        it('should change available status', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);
            prisma.product.update.mockResolvedValueOnce({
                ...productMock,
                available: false,
            });

            // Act
            const result = await service.toggle(productMock.SKU);

            expect(result.available).toEqual(false);
            expect(prisma.product.update).toHaveBeenCalled();
        });

        it('should delete products on carts', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValueOnce(productMock);
            prisma.product.update.mockResolvedValueOnce(productMock);
            prisma.productsOnCarts.deleteMany.mockResolvedValueOnce({
                count: 0,
            });

            // Act
            const result = await service.toggle(productMock.SKU);

            // Assert
            expect(result.available).toEqual(true);
            expect(prisma.product.update).toHaveBeenCalled();
        });
    });

    describe('likeProduct', () => {
        it('should like a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.likesOnProducts.findUnique.mockResolvedValue(null);
            prisma.likesOnProducts.create.mockResolvedValue({
                userId: 3,
                productSKU: productMock.SKU,
            });

            // Act
            const result = await service.likeProduct(3, productMock.SKU);

            // Assert
            expect(result).toEqual({ userId: 3, productSKU: productMock.SKU });
        });

        it('should remove a like from a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.likesOnProducts.findUnique.mockResolvedValue({
                userId: 3,
                productSKU: productMock.SKU,
            });
            prisma.likesOnProducts.delete.mockResolvedValue({
                userId: 3,
                productSKU: productMock.SKU,
            });

            // Act
            const result = await service.likeProduct(3, productMock.SKU);

            // Assert
            expect(result).toEqual({ userId: 3, productSKU: productMock.SKU });
        });
    });

    describe('getFavoriteList', () => {
        it('should get all favorite lists', async () => {
            // Arrange
            prisma.likesOnProducts.findMany.mockResolvedValueOnce(
                likesOnProductsMock
            );
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockResolvedValue(productMock);
            prisma.product.delete.mockResolvedValue(productMock);

            // Act
            const result = await service.delete(productMock.SKU);

            // Assert
            expect(prisma.product.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('SKU', expect.any(Number));
        });

        it('should fail when updated a product that does not exists', async () => {
            // Arrange
            prisma.product.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & assert
            await expect(service.delete(1000)).rejects.toThrow(
                'Product 1000 not found'
            );
        });
    });
});
