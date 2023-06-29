import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dtos/input/create-product.input';
import { UpdateProductInput } from './dtos/input/update-product.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '@auth/decorators/role.decorator';
import { Public } from '@auth/decorators/public.decorator';
import { LikeOnProduct } from './entities/like-on-product.entity';
import { CategoryService } from '@category/category.service';
import { Product, User } from '@prisma/client';
import { ProductEntity } from './entities/product.entity';
import { UserDecorator } from '@user/decorators/user.decorator';

@Resolver(() => ProductEntity)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly caategoryService: CategoryService
    ) {}

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductEntity, { name: 'createProduct' })
    async create(
        @Args('createProductInput') createProductInput: CreateProductInput
    ) {
        return this.productService.create(createProductInput);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductEntity, { name: 'updateProduct' })
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
    @Mutation(() => ProductEntity, { name: 'deleteProduct' })
    async delete(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.delete(SKU);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductEntity, { name: 'toggleProduct' })
    async toggle(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.toggle(SKU);
    }

    @Mutation(() => LikeOnProduct, { name: 'likeProduct' })
    async likeProduct(
        @UserDecorator() user: User,
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<LikeOnProduct> {
        return this.productService.likeProduct(user.id, SKU);
    }

    @Query(() => [LikeOnProduct], { name: 'getMyFavoriteList' })
    async getFavorites(
        @UserDecorator() user: User,
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<LikeOnProduct[]> {
        return this.productService.getFavoriteList(user.id, SKU);
    }

    @Public()
    @Query(() => [ProductEntity], { name: 'getProductsByCategory' })
    async getProductsByCategory(
        @Args('categoryId', { type: () => Int }) id: number,
        @Args() paginationArgs: PaginationArgs
    ): Promise<Product[]> {
        return this.productService.getProductByCategory(id, paginationArgs);
    }

    @Public()
    @Query(() => ProductEntity, { name: 'findOneProduct' })
    async findOne(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.findOne({ SKU });
    }

    @Public()
    @Query(() => [ProductEntity], { name: 'findAllProducts' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Product[]> {
        return this.productService.findAll(paginationArgs);
    }

    @ResolveField()
    async category(@Parent() product: Product) {
        const { categoryId } = product;

        return this.caategoryService.findOne({ id: categoryId });
    }
}
