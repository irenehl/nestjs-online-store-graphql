import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryEntity {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;
}
