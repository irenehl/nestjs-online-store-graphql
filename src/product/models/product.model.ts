import { CategoryModel } from '@category/models/category.model';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
    @Field(() => Int)
    SKU: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    stock: number;

    @Field(() => Boolean)
    available: boolean;

    @Field(() => CategoryModel)
    category: CategoryModel;

    categoryId: number;

    @Field(() => String, { nullable: true })
    image?: string | null;

    @Field(() => String)
    uploadUrl: string;
}
