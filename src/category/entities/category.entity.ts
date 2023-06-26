import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Category {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;
}