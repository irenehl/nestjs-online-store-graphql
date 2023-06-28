import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entitites/user.entity';
import { CreateUserInput } from './dtos/inputs/create-user.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { UpdateUserInput } from './dtos/inputs/update-user.input';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';

@Resolver(() => User)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => User, { name: 'createUser' })
    async create(
        @Args('createUserInput') createUserInput: CreateUserInput
    ): Promise<User> {
        return this.userService.create(createUserInput);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => User, { name: 'updateUser' })
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput
    ): Promise<User> {
        return this.userService.update(updateUserInput.id, updateUserInput);
    }

    // TODO: Auth
    @UseGuards(JwtAuthGuard)
    @Mutation(() => User, { name: 'deleteUser' })
    async deleteUser(
        @Args('id', { type: () => ID }, ParseIntPipe) id: number
    ): Promise<User> {
        return this.userService.delete(id);
    }

    @Query(() => User, { name: 'findOneUser' })
    async getOne(@Args('id', { type: () => Int }) id: number) {
        return this.userService.findOne({ id });
    }

    @Query(() => [User], { name: 'findAllUsers' })
    async getAll(@Args() paginationArgs: PaginationArgs): Promise<User[]> {
        return this.userService.findAll(paginationArgs);
    }
}
