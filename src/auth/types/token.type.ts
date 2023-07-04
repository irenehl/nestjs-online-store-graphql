import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenModel {
    @Field(() => String)
    access_token: string;
}
