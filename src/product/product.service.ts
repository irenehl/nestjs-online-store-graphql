import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { S3Service } from '@aws/s3.service';
import { CategoryService } from '@category/category.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dtos/input/create-product.input';
import { UpdateProductInput } from './dtos/input/update-product.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private s3: S3Service,
        private categoryService: CategoryService
    ) {}

    async create(
        data: CreateProductInput,
        image?: Express.Multer.File
    ): Promise<Product> {
        if (
            await this.prisma.product.findUniqueOrThrow({
                where: { name: data.name },
            })
        )
            throw new BadRequestException('Product already exists');

        await this.categoryService.findOne({ id: data.categoryId });

        if (!image)
            return await this.prisma.product.create({
                data,
                include: {
                    category: true,
                },
            });

        const product = await this.prisma.product.create({
            data,
            include: {
                category: true,
            },
        });

        const { fileName, url } = await this.s3.uploadFile(image);

        return await this.prisma.product.update({
            where: { SKU: product.SKU },
            data: {
                image: fileName,
                imageUrl: url,
            },
            include: {
                category: true,
            },
        });
    }

    async findOne(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
        return await this.prisma.product
            .findUniqueOrThrow({
                where,
                include: {
                    category: true,
                },
            })
            .catch(() => {
                throw new NotFoundException(`Product ${where.SKU} not found`);
            });
    }

    async findAll(
        params: PaginationArgs & {
            cursor?: Prisma.ProductWhereUniqueInput;
            where?: Prisma.ProductWhereInput;
            orderBy?: Prisma.ProductOrderByWithAggregationInput;
        }
    ): Promise<Product[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.product.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
            include: {
                category: true,
            },
        });
    }

    async getProductByCategory(categoryId: number): Promise<ProductDto[]> {
        const products = await this.prisma.product.findMany({
            where: {
                categoryId,
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map(ProductDto.toDto);
    }

    async update(
        SKU: number,
        data: UpdateProductInput & { image?: string; imageUrl?: string },
        image?: Express.Multer.File
    ): Promise<Product> {
        const product = await this.findOne({ SKU });

        if (image) {
            const { fileName, url } = await (product.image
                ? this.s3.replaceFile(image, product.image)
                : this.s3.uploadFile(image));

            data.image = fileName;
            data.imageUrl = url;
        }

        return await this.prisma.product.update({
            data,
            where: {
                SKU,
            },
            include: {
                category: true,
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

        return await this.prisma.product.update({
            where: { SKU },
            data: {
                available: !product.available,
            },
            include: {
                category: true,
            },
        });
    }

    async likeProduct(userId: number, SKU: number): Promise<any> {
        const _ = await this.findOne({ SKU });

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
                  include: {
                      product: true,
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
                  include: {
                      product: true,
                  },
              });
    }

    async delete(SKU: number): Promise<Product> {
        const _ = await this.findOne({ SKU });

        return await this.prisma.product.delete({
            where: {
                SKU,
            },
            include: {
                category: true,
            },
        });
    }
}
