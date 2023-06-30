import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductOnOrderEntity } from './product-on-order.entity';

@ObjectType()
export class OrderEntity {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Float)
    total: number;

    @Field(() => [ProductOnOrderEntity])
    items: ProductOnOrderEntity[];
}
