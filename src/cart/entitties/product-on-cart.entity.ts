import { Field, Int } from '@nestjs/graphql';
import { Product } from '@product/entities/product.entity';

export class ProductOnCart {
    @Field(() => Int)
    quantity: number;

    @Field(() => Product)
    product: Product;
}
