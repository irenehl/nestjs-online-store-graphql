import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductService } from '@product/product.service';
import { ProductModel } from '@product/models/product.model';
import { ProductsOnOrders } from '@prisma/client';
import { ProductOnOrderModel } from './models/product-on-order.model';

@Resolver(() => ProductOnOrderModel)
export class ProductOnOrderResolver {
    constructor(private readonly productService: ProductService) {}

    @ResolveField('product', () => ProductModel)
    async product(@Parent() productOnCart: ProductsOnOrders) {
        const { productSKU: SKU } = productOnCart;

        return this.productService.findOne({ SKU });
    }
}
