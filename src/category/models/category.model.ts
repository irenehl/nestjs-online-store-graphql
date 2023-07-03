import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryModel {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;
}
