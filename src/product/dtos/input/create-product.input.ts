import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => String)
    @IsString()
    description: string;

    @Field(() => Float)
    @IsNumber()
    price: number;

    @Field(() => Int)
    @IsNumber()
    stock: number;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    available?: boolean;

    @Field(() => Int)
    categoryId: number;
}
