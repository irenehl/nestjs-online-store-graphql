import { ProductOnCart } from '@cart/entitties/product-on-cart.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Float)
    total: number;

    @Field(() => [ProductOnCart])
    items: ProductOnCart[];
}
