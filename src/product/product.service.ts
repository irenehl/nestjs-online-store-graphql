import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { S3Service } from '@aws/s3.service';
import { CategoryService } from '@category/category.service';
import { CreateProductInput } from './dtos/input/create-product.input';
import { UpdateProductInput } from './dtos/input/update-product.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { LikeOnProductModel } from './models/like-on-product.model';
import { Product } from '@prisma/client';

@Injectable()
// TODO: Review how to send image wiht saving in the URL in all the methods that return the product is necessary
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private s3: S3Service,
        private categoryService: CategoryService
    ) {}

    async create(data: CreateProductInput) {
        if (
            await this.prisma.product.findUnique({
                where: { name: data.name },
            })
        )
            throw new BadRequestException('Product already exists');

        await this.categoryService.findOne({
            id: data.categoryId,
        });

        const { key } = await this.s3.generatePresignedUrl(`SKU-${data.name}`);

        return this.prisma.product.create({
            data: {
                ...data,
                image: key,
            },
        });
    }

    // TODO: Check this promise
    async findOne(
        where: Prisma.ProductWhereUniqueInput
    ): Promise<Product & { imageUrl: string }> {
        const product = await this.prisma.product
            .findUniqueOrThrow({
                where,
            })
            .catch(() => {
                throw new NotFoundException(`Product ${where.SKU} not found`);
            });

        const { uploadUrl } = await this.s3.generatePresignedUrl(
            `SKU-${product.name}`
        );

        return {
            ...product,
            imageUrl: uploadUrl,
        };
    }

    // TODO: Return image peer product
    async findAll(
        params: PaginationArgs & {
            cursor?: Prisma.ProductWhereUniqueInput;
            where?: Prisma.ProductWhereInput;
            orderBy?: Prisma.ProductOrderByWithAggregationInput;
        }
    ): Promise<Product[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.product.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }

    // TODO: Return image peer product
    async getProductByCategory(
        categoryId: number,
        params: PaginationArgs & {
            cursor?: Prisma.ProductWhereUniqueInput;
            where?: Prisma.ProductWhereInput;
            orderBy?: Prisma.ProductOrderByWithAggregationInput;
        }
    ): Promise<Product[]> {
        const { page, limit, cursor, orderBy } = params;

        return this.prisma.product.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where: {
                categoryId,
            },
            orderBy,
        });
    }

    async update(
        SKU: number,
        data: UpdateProductInput & { image?: string; imageUrl?: string }
    ): Promise<Product> {
        await this.findOne({ SKU });

        const { key } = await this.s3.generatePresignedUrl(`SKU-${data.name}`);

        return this.prisma.product.update({
            data: {
                ...data,
                image: key,
            },
            where: {
                SKU,
            },
        });
    }

    async isAvailable(SKU: number, amount: number): Promise<boolean> {
        const product = await this.findOne({ SKU });

        return product.stock >= amount;
    }

    async toggle(SKU: number): Promise<Product> {
        const product = await this.findOne({ SKU });

        if (product.available) {
            await this.prisma.productsOnCarts.deleteMany({
                where: {
                    productSKU: product.SKU,
                },
            });
        }

        return this.prisma.product.update({
            where: { SKU },
            data: {
                available: !product.available,
            },
        });
    }

    async likeProduct(
        userId: number,
        SKU: number
    ): Promise<LikeOnProductModel> {
        await this.findOne({ SKU });

        const isLiked = await this.prisma.likesOnProducts.findUnique({
            where: {
                userId_productSKU: {
                    userId,
                    productSKU: SKU,
                },
            },
        });

        return isLiked
            ? await this.prisma.likesOnProducts.delete({
                  where: {
                      userId_productSKU: {
                          userId,
                          productSKU: SKU,
                      },
                  },
              })
            : await this.prisma.likesOnProducts.create({
                  data: {
                      user: {
                          connect: {
                              id: userId,
                          },
                      },
                      product: {
                          connect: {
                              SKU,
                          },
                      },
                  },
              });
    }

    async getFavoriteList(userId: number): Promise<LikeOnProductModel[]> {
        return this.prisma.likesOnProducts.findMany({
            where: {
                userId,
            },
        });
    }

    async delete(SKU: number): Promise<Product> {
        await this.findOne({ SKU });

        return this.prisma.product.delete({
            where: {
                SKU,
            },
        });
    }
}
