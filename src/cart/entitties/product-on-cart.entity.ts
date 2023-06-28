import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductOnCart {
    @Field(() => Int)
    quantity: number;

    @Field(() => Int)
    cartId: number;

    @Field(() => Int)
    productSKU: number;
}
