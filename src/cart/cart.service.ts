import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { AddProductToCartInput } from './dtos/inputs/add-product.input';
import { ProductOnCart } from './entitties/product-on-cart.entity';
import { Cart } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(
        private prisma: PrismaService,
        private productService: ProductService
    ) {}

    async findOne(userId: number): Promise<Cart> {
        const a = await this.prisma.cart
            .findFirstOrThrow({
                where: { userId },
                include: {
                    products: true,
                },
            })
            .catch(() => {
                throw new NotFoundException('Cart not found');
            });

        return a;
    }

    async addProduct(
        userId: number,
        data: AddProductToCartInput
    ): Promise<any> {
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

        const b = await this.findOne(cart.userId);

        console.log(b);

        return b;
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
