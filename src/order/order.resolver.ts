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
import { Order, User } from '@prisma/client';
import { UserDecorator } from '@user/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@auth/decorators/role.decorator';

@Resolver(() => OrderEntity)
@UseGuards(JwtAuthGuard)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Query(() => OrderEntity, { name: 'getMyOrder' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<Order> {
        return this.orderService.findOne({ id });
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Query(() => [OrderEntity], { name: 'getAllOrders' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Order[]> {
        return this.orderService.findAll(paginationArgs);
    }

    @Mutation(() => OrderEntity, { name: 'placeOrder' })
    async placeOrder(@UserDecorator() user: User): Promise<Order> {
        return this.orderService.placeOrder(user.id);
    }

    @ResolveField()
    async items(@Parent() cart: Order) {
        const { id } = cart;

        return this.orderService.findProductsOnOrders(id);
    }
}
