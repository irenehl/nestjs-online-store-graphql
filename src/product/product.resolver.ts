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
import { LikeOnProductModel } from './models/like-on-product.model';
import { CategoryService } from '@category/category.service';
import { Product, User } from '@prisma/client';
import { ProductModel } from './models/product.model';
import { UserDecorator } from '@user/decorators/user.decorator';

@Resolver(() => ProductModel)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly caategoryService: CategoryService
    ) {}

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductModel, { name: 'createProduct' })
    async createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput
    ) {
        return this.productService.create(createProductInput);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductModel, { name: 'updateProduct' })
    async updateProduct(
        @Args('updateProductInput') updateProductInput: UpdateProductInput
    ): Promise<Product> {
        return this.productService.update(
            updateProductInput.SKU,
            updateProductInput
        );
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductModel, { name: 'deleteProduct' })
    async deleteProduct(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.delete(SKU);
    }

    @UseGuards(RolesGuard)
    @Role('MANAGER')
    @Mutation(() => ProductModel, { name: 'toggleProduct' })
    async toggleProduct(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.toggle(SKU);
    }

    @UseGuards(RolesGuard)
    @Role('CLIENT')
    @Mutation(() => LikeOnProductModel, { name: 'likeProduct' })
    async likeProduct(
        @UserDecorator() user: User,
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<LikeOnProductModel> {
        return this.productService.likeProduct(user.id, SKU);
    }

    @Query(() => [LikeOnProductModel], { name: 'getMyFavoriteList' })
    async getMyFavoriteList(
        @UserDecorator() user: User
    ): Promise<LikeOnProductModel[]> {
        return this.productService.getFavoriteList(user.id);
    }

    @Public()
    @Query(() => [ProductModel], { name: 'getProductsByCategory' })
    async getProductsByCategory(
        @Args('categoryId', { type: () => Int }) id: number,
        @Args() paginationArgs: PaginationArgs
    ): Promise<Product[]> {
        return this.productService.getProductByCategory(id, paginationArgs);
    }

    @Public()
    @Query(() => ProductModel, { name: 'findOneProduct' })
    async findOneProduct(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.findOne({ SKU });
    }

    @Public()
    @Query(() => [ProductModel], { name: 'findAllProducts' })
    async findAllProducts(
        @Args() paginationArgs: PaginationArgs
    ): Promise<Product[]> {
        return this.productService.findAll(paginationArgs);
    }

    @ResolveField()
    async category(@Parent() product: Product) {
        const { categoryId } = product;

        return this.caategoryService.findOne({ id: categoryId });
    }
}
