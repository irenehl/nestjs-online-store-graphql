import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StockNotificationModel {
    @Field(() => [String])
    users: string[];

    @Field(() => Int)
    quantity: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    img: string;
}
