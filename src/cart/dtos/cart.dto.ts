import { Cart } from '@prisma/client';
import { ProductDto } from '@product/dtos/product.dto';
import { ProductOnCartDto } from './product-on-cart.dto';

export class CartDto {
    id: number;
    userId: number;

    items: ProductOnCartDto[];

    static toDto(
        cart: Cart & { products: { product: ProductDto; quantity: number }[] }
    ): CartDto {
        return {
            id: cart.id,
            userId: cart.userId,
            items: cart.products,
        };
    }
}
