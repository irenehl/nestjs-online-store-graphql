import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { AddProductToCartInput } from './dtos/inputs/add-product.input';
import { Cart } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(
        private prisma: PrismaService,
        private productService: ProductService
    ) {}

    async findOne(userId: number): Promise<Cart> {
        return await this.prisma.cart
            .findFirstOrThrow({
                where: { userId },
            })
            .catch(() => {
                throw new NotFoundException('Cart not found');
            });
    }

    async findProductsOnCart(cartId: number) {
        return await this.prisma.productsOnCarts.findMany({
            where: { cartId },
        });
    }

    async addProduct(userId: number, data: AddProductToCartInput) {
        if (!(await this.productService.isAvailable(data.SKU, data.quantity)))
            throw new BadRequestException('Quantity exceeds current stock');

        const cart = await this.findOne(userId);

        await this.prisma.productsOnCarts.upsert({
            where: {
                cartId_productSKU: {
                    cartId: cart.id,
                    productSKU: data.SKU,
                },
            },
            create: {
                productSKU: data.SKU,
                quantity: data.quantity,
                cartId: cart.id,
            },
            update: {
                quantity: data.quantity,
            },
        });

        return await this.findOne(cart.userId);
    }

    async deleteProductOnCart(userId: number, SKU: number) {
        const cart = await this.findOne(userId);

        await this.prisma.productsOnCarts
            .findUniqueOrThrow({
                where: {
                    cartId_productSKU: {
                        productSKU: SKU,
                        cartId: cart.id,
                    },
                },
            })
            .catch(() => {
                throw new NotFoundException(
                    `Product ${SKU} is not in this cart`
                );
            });

        await this.prisma.productsOnCarts.delete({
            where: {
                cartId_productSKU: {
                    productSKU: SKU,
                    cartId: cart.id,
                },
            },
            select: {
                product: true,
                quantity: true,
            },
        });

        return await this.findOne(cart.userId);
    }
}
