import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ProductService } from '@product/product.service';
import { ProductEntity } from '@product/entities/product.entity';
import { ProductsOnOrders } from '@prisma/client';
import { ProductOnOrderEntity } from './entities/product-on-order.entity';

@Resolver(() => ProductOnOrderEntity)
export class ProductOnOrderResolver {
    constructor(private readonly productService: ProductService) {}

    @ResolveProperty('product', () => ProductEntity)
    async product(@Parent() productOnCart: ProductsOnOrders) {
        const { productSKU: SKU } = productOnCart;

        return this.productService.findOne({ SKU });
    }
}
