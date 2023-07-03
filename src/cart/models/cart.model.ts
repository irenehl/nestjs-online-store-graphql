import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductOnCartModel } from './product-on-cart.model';

@ObjectType()
export class CartModel {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => [ProductOnCartModel])
    items: ProductOnCartModel[];
}
