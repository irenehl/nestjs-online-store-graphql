import { CategoryEntity } from '@category/entities/category.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductEntity {
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

    @Field(() => CategoryEntity)
    category: CategoryEntity;

    categoryId: number;

    @Field(() => String, { nullable: true })
    image?: string | null;

    @Field(() => String, { nullable: true })
    imageUrl?: string | null;
}
