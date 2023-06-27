import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dtos/input/create-product.input';
import { UpdateProductInput } from './dtos/input/update-product.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';

@Resolver()
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    // TODO: Auth
    // TODO: Admin role
    @Mutation(() => Product, { name: 'createProduct' })
    async create(
        @Args('createProductInput') createProductInput: CreateProductInput
    ): Promise<Product> {
        return this.productService.create(createProductInput);
    }

    // TODO: Auth
    // TODO: Admin role
    @Mutation(() => Product, { name: 'updateProduct' })
    async update(
        @Args('updateProductInput') updateProductInput: UpdateProductInput
    ): Promise<Product> {
        return this.productService.update(
            updateProductInput.SKU,
            updateProductInput
        );
    }

    // TODO: Auth
    // TODO: Admin role
    @Mutation(() => Product, { name: 'deleteProduct' })
    async delete(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.delete(SKU);
    }

    // TODO: Auth
    // TODO: Admin role
    @Mutation(() => Product, { name: 'toggleProduct' })
    async toggle(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.toggle(SKU);
    }

    // TODO: Auth
    // TODO: Fix user id
    @Mutation(() => Product, { name: 'likeProduct' })
    async likeProduct(@Args('SKU', { type: () => Int }) SKU: number) {
        console.log(SKU);
        return this.productService.likeProduct(2, SKU);
    }

    @Query(() => Product, { name: 'findOneProduct' })
    async findOne(
        @Args('SKU', { type: () => Int }) SKU: number
    ): Promise<Product> {
        return this.productService.findOne({ SKU });
    }

    @Query(() => [Product], { name: 'findAllProducts' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Product[]> {
        return this.productService.findAll(paginationArgs);
    }
}
