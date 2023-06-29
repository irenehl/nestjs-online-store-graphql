import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StockNotificationEntity {
    @Field(() => [String])
    users: string[];

    @Field(() => Int)
    quantity: number;

    @Field(() => String)
    name: string;
}
