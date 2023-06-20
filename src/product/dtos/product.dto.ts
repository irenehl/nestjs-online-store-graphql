import { Product } from '@prisma/client';

export class ProductDto {
    SKU: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string | null;
    imageUrl?: string | null;
    available: boolean;
    category?: string | null;

    static toDto(
        product: Product & { category: { name: string } | null }
    ): ProductDto {
        return {
            SKU: product.SKU,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            imageUrl: product.imageUrl,
            available: product.available,
            category: product.category?.name,
        };
    }
}
