import { IPagination } from '@common/interfaces/pagination.dto';
import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderDto } from './dtos/order.dto';
import { SesService } from '@aws/ses.service';
import { StockNotificationDto } from './dtos/stock-notification.dto';
import cartAlertHtml from '../mail/cart-alert.html';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService, private ses: SesService) {}

    async findOne(where: Prisma.OrderWhereUniqueInput): Promise<any> {
        const a = await this.prisma.order
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new NotFoundException('Order not found');
            });
        console.log(a);

        return a;
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.OrderWhereUniqueInput;
            where?: Prisma.OrderWhereInput;
            orderBy?: Prisma.UserOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;
        return this.prisma.order.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }

    async placeOrder(userId: number) {
        return this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart
                .findFirstOrThrow({
                    where: { userId },
                    include: {
                        products: {
                            select: {
                                product: true,
                                quantity: true,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new NotFoundException('Cart not found');
                });

            const order = await tx.order.create({
                data: {
                    userId,
                },
            });

            let totalAmount = 0;
            const notifications: StockNotificationDto[] = [];

            await Promise.all(
                cart.products.map(async ({ product, quantity }) => {
                    const updatedProduct = await tx.product.update({
                        where: { SKU: product.SKU },
                        data: {
                            stock: {
                                decrement: quantity,
                            },
                        },
                    });

                    if (updatedProduct.stock < 0)
                        throw new BadRequestException(
                            `Quantity (${quantity}) of product with SKU: ${product.SKU} exceeds current stock (${product.stock})`
                        );

                    if (updatedProduct.stock <= 3) {
                        const carts = await tx.productsOnCarts.findMany({
                            where: {
                                productSKU: updatedProduct.SKU,
                            },
                            select: {
                                cartId: true,
                            },
                        });

                        notifications.push({
                            name: product.name,
                            quantity: product.stock,
                            users: (
                                await tx.user.findMany({
                                    where: {
                                        cart: {
                                            id: {
                                                in: carts.map(
                                                    (cart) => cart.cartId
                                                ),
                                            },
                                        },
                                    },
                                    select: {
                                        email: true,
                                    },
                                })
                            ).map(({ email }) => email),
                        });
                    }

                    await tx.productsOnOrders.create({
                        data: {
                            productSKU: product.SKU,
                            orderId: order.id,
                            quantity,
                        },
                    });

                    await tx.productsOnCarts.delete({
                        where: {
                            cartId_productSKU: {
                                cartId: cart.id,
                                productSKU: product.SKU,
                            },
                        },
                    });

                    totalAmount += product.price * quantity;
                })
            );

            if (notifications && notifications.length > 0) {
                await Promise.all(
                    notifications.map(async (notification) =>
                        this.ses.sendEmail({
                            htmlTemplate: cartAlertHtml,
                            subject: 'Check your cart!',
                            textReplacer: (data) =>
                                data
                                    .replace('{PRODUCT_NAME', notification.name)
                                    .replace(
                                        '{PRODUCT_STOCK}',
                                        notification.quantity.toString()
                                    ),
                            toAddresses: notification.users,
                        })
                    )
                );
            }

            return OrderDto.toDto(
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        total: totalAmount,
                    },
                    include: {
                        products: {
                            select: {
                                product: true,
                                quantity: true,
                            },
                        },
                    },
                })
            );
        });
    }
}
