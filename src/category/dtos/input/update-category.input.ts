import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
    @Field(() => Int)
    @IsInt()
    id: number;

    @Field(() => String)
    @IsString()
    name: string;
}
