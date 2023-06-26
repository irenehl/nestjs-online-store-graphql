import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    lastname: string;

    @Field(() => String)
    username: string;

    @Field(() => String)
    email: string;

    @Field(() => String, { nullable: true })
    recovery?: string | null;

    @Field(() => String)
    role: string;
}
