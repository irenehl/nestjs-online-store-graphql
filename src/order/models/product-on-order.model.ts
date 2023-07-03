import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductModel } from '@product/models/product.model';

@ObjectType()
export class ProductOnOrderModel {
    @Field(() => Int)
    quantity: number;

    @Field(() => ProductModel)
    product: ProductModel;
}
