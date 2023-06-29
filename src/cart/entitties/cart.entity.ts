import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductOnCart } from './product-on-cart.entity';

@ObjectType()
export class CartEntity {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => [ProductOnCart])
    items: ProductOnCart[];
}
