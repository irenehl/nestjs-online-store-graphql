import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddProductToCartInput {
    @Field(() => Int)
    SKU: number;

    @Field(() => Int)
    quantity: number;
}
