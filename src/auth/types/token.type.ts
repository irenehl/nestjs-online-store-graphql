import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
    @Field(() => String)
    access_token: string;
}
