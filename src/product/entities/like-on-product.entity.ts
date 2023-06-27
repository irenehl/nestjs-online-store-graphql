import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
export class LikeOnProduct {
    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    productSKU: number;
}
