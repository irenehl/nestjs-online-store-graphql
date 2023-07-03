import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartEntity } from './entitties/cart.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserDecorator } from '@user/decorators/user.decorator';
import { Cart, User } from '@prisma/client';
import { Role } from '@auth/decorators/role.decorator';
import { AddProductToCartInput } from './dtos/inputs/add-product.input';

@Resolver(() => CartEntity)
@Role('CLIENT')
@UseGuards(JwtAuthGuard)
export class CartResolver {
    constructor(private readonly cartService: CartService) {}

    @Query(() => CartEntity, { name: 'findMyCart' })
    async findMyCart(@UserDecorator() user: User): Promise<Cart> {
        return this.cartService.findOne(Number(user.id));
    }

    @Mutation(() => CartEntity, { name: 'addProductToCart' })
    async addProductToCart(
        @UserDecorator() user: User,
        @Args('addProductsToCartInput')
        addProductsToCartInput: AddProductToCartInput
    ): Promise<Cart> {
        return this.cartService.addProduct(user.id, addProductsToCartInput);
    }

    @Mutation(() => CartEntity, { name: 'deleteProductOnCart' })
    async deleteProductOnCart(
        @UserDecorator() user: User,
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Cart> {
        return this.cartService.deleteProductOnCart(user.id, SKU);
    }

    @ResolveField()
    async items(@Parent() cart: Cart) {
        const { id } = cart;

        return this.cartService.findProductsOnCart(id);
    }
}
