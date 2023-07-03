import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LikeOnProductModel {
    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    productSKU: number;
}
