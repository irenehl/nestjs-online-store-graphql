import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dtos/input/create-category.input';
import { UpdateCategoryInput } from './dtos/input/update-category.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';

@Resolver()
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Mutation(() => Category, { name: 'createCategory' })
    async create(
        @Args('createCategoryInput') createCategoryInput: CreateCategoryInput
    ): Promise<Category> {
        return this.categoryService.create(createCategoryInput);
    }

    @Mutation(() => Category, { name: 'updateCategory' })
    async update(
        @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput
    ): Promise<Category> {
        return this.categoryService.update(
            { id: updateCategoryInput.id },
            updateCategoryInput
        );
    }

    @Mutation(() => Category, { name: 'deleteCategory' })
    async delete(
        @Args('id', { type: () => Int }) id: number
    ): Promise<Category> {
        return this.categoryService.delete({ id });
    }

    @Query(() => Category, { name: 'findOneCategory' })
    async findOne(
        @Args('id', { type: () => Int }) id: number
    ): Promise<Category> {
        return this.categoryService.findOne({ id });
    }

    @Query(() => [Category], { name: 'findAllCategories' })
    async findAll(@Args() paginationArgs: PaginationArgs): Promise<Category[]> {
        return this.categoryService.findAll(paginationArgs);
    }
}
