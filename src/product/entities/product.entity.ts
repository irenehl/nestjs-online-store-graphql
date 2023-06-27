import { Category } from '@category/entities/category.entity';
import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class Product {
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

    @Field(() => Category)
    category: Category;

    @Field(() => String, { nullable: true })
    image?: string | null;

    @Field(() => String, { nullable: true })
    imageUrl?: string | null;
}
