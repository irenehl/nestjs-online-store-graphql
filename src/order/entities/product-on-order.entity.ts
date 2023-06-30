import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductEntity } from '@product/entities/product.entity';

@ObjectType()
export class ProductOnOrderEntity {
    @Field(() => Int)
    quantity: number;

    @Field(() => ProductEntity)
    product: ProductEntity;
}
