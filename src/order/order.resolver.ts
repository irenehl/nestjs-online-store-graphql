import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';

@Resolver()
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Query(() => Order, { name: 'getMyOrder' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<Order> {
        return this.orderService.findOne({ id });
    }
}
