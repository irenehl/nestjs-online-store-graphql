import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductOnCartModel {
    @Field(() => Int)
    quantity: number;

    @Field(() => Int)
    cartId: number;

    @Field(() => Int)
    productSKU: number;
}
