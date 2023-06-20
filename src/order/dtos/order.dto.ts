import { ProductOnCartDto } from '@cart/dtos/product-on-cart.dto';
import { Order } from '@prisma/client';
import { ProductDto } from '@product/dtos/product.dto';

export class OrderDto {
    id: number;
    userId: number;
    total: number;

    items: ProductOnCartDto[];

    static toDto(
        order: Order & { products: { product: ProductDto; quantity: number }[] }
    ): OrderDto {
        return {
            id: order.id,
            userId: order.userId,
            items: order.products,
            total: order.total,
        };
    }
}
