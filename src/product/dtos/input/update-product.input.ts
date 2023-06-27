import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProductInput {
    @Field(() => Int)
    SKU: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    price?: number;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    stock?: number;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    available?: boolean;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    categoryId?: number;
}
