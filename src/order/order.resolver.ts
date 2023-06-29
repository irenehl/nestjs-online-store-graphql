import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { Order } from '@prisma/client';

@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Query(() => OrderEntity, { name: 'getMyOrder' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<Order> {
        return this.orderService.findOne({ id });
    }

    @Query(() => [OrderEntity], { name: 'getAllOrders' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Order[]> {
        return this.orderService.findAll(paginationArgs);
    }

    @Mutation(() => OrderEntity, { name: 'placeOrder' })
    async placeOrder(@Args('userId', { type: () => Int }) userId: number) {
        return this.orderService.placeOrder(userId);
    }

    @ResolveField()
    async items(@Parent() cart: Order) {
        const { id } = cart;

        return this.orderService.findProductsOnOrders(id);
    }
}
