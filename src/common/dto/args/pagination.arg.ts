import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { defaultValue: 1 })
    @IsOptional()
    @Min(0)
    page?: number;

    @Field(() => Int, { defaultValue: 15 })
    @IsOptional()
    @Min(0)
    limit?: number;
}
