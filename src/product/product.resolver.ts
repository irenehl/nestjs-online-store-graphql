import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dtos/input/create-product.input';
import { UpdateProductInput } from './dtos/input/update-product.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '@auth/decorators/role.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { LikeOnProduct } from './entities/like-on-product.entity';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    // TODO: Missing img
    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => Product, { name: 'createProduct' })
    async create(
        @Args('createProductInput') createProductInput: CreateProductInput
    ): Promise<Product> {
        return this.productService.create(createProductInput);
    }

    // TODO: Missing img
    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => Product, { name: 'updateProduct' })
    async update(
        @Args('updateProductInput') updateProductInput: UpdateProductInput
    ): Promise<Product> {
        return this.productService.update(
            updateProductInput.SKU,
            updateProductInput
        );
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => Product, { name: 'deleteProduct' })
    async delete(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.delete(SKU);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => Product, { name: 'toggleProduct' })
    async toggle(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.toggle(SKU);
    }

    // TODO: Fix user id
    @Mutation(() => LikeOnProduct, { name: 'likeProduct' })
    async likeProduct(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<LikeOnProduct> {
        return this.productService.likeProduct(2, SKU);
    }

    // TODO: Fix user id
    @Query(() => [LikeOnProduct], { name: 'getMyFavoriteList' })
    async getFavorites(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<LikeOnProduct[]> {
        return this.productService.getFavoriteList(2, SKU);
    }

    @Public()
    @Query(() => [Product], { name: 'getProductsByCategory' })
    async getProductsByCategory(
        @Args('categoryId', { type: () => Int }) id: number,
        @Args() paginationArgs: PaginationArgs
    ): Promise<Product[]> {
        return this.productService.getProductByCategory(id, paginationArgs);
    }

    @Public()
    @Query(() => Product, { name: 'findOneProduct' })
    async findOne(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.findOne({ SKU });
    }

    @Public()
    @Query(() => [Product], { name: 'findAllProducts' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Product[]> {
        return this.productService.findAll(paginationArgs);
    }
}
