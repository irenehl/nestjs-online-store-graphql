import { Field, Int } from '@nestjs/graphql';
import { ProductOnCart } from './product-on-cart.entity';

export class Cart {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => ProductOnCart)
    items: ProductOnCart[];
}
