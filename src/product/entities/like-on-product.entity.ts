import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LikeOnProduct {
    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    productSKU: number;
}
