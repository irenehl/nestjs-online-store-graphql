import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductOnOrderModel } from './product-on-order.model';

@ObjectType()
export class OrderModel {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Float)
    total: number;

    @Field(() => [ProductOnOrderModel])
    items: ProductOnOrderModel[];
}
