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
import { Payload } from '@auth/entities/payload.entity';
import { CartEntity } from './entitties/cart.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserDecorator } from '@user/decorators/user.decorator';
import { Cart, Product, User } from '@prisma/client';
import { Role } from '@auth/decorators/role.decorator';
import { AddProductToCartInput } from './dtos/inputs/add-product.input';
import { ProductOnCart } from './entitties/product-on-cart.entity';
import { ProductService } from '@product/product.service';

@Resolver(() => CartEntity)
@Role('CLIENT')
@UseGuards(JwtAuthGuard)
export class CartResolver {
    constructor(
        private readonly cartService: CartService,
        private readonly productService: ProductService
    ) {}

    @Query(() => CartEntity, { name: 'findMyCart' })
    async findOne(@UserDecorator() user: User): Promise<Cart> {
        return this.cartService.findOne(Number(user.id));
    }

    @Mutation(() => ProductOnCart, { name: 'addProductToCart' })
    async addProductToCart(
        @UserDecorator() user: User,
        @Args('addProductsToCartInput')
        addProductsToCartInput: AddProductToCartInput
    ): Promise<ProductOnCart> {
        return this.cartService.addProduct(user.id, addProductsToCartInput);
    }

    @Mutation(() => CartEntity, { name: 'deleteProductToCart' })
    async deleteProductToCart(
        @UserDecorator() user: User,
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Cart> {
        return this.cartService.deleteProductOnCart(user.id, SKU);
    }

    @ResolveField()
    async products(@Parent() product: Product) {
        const { SKU } = product;

        return this.productService.findOne({ SKU });
    }
}
