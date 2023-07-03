import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entitites/user.entity';
import { CreateUserInput } from './dtos/inputs/create-user.input';
import { PaginationArgs } from '@common/dto/args/pagination.arg';
import { UpdateUserInput } from './dtos/inputs/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public } from '@auth/decorators/public.decorator';
import { UserDecorator } from './decorators/user.decorator';
import { User } from '@prisma/client';

@Resolver(() => UserEntity)
@UseGuards(JwtAuthGuard)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Public()
    @Mutation(() => UserEntity, { name: 'createUser' })
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput
    ): Promise<User> {
        return this.userService.create(createUserInput);
    }

    @Mutation(() => UserEntity, { name: 'updateUser' })
    async updateUser(
        @UserDecorator() user: User,
        @Args('updateUserInput') updateUserInput: UpdateUserInput
    ): Promise<User> {
        return this.userService.update(user.id, updateUserInput);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserEntity, { name: 'deleteUser' })
    async deleteUser(@UserDecorator() user: User): Promise<User> {
        return this.userService.delete(user.id);
    }

    @Query(() => UserEntity, { name: 'findOneUser' })
    async findOneUser(
        @Args('id', { type: () => Int }) id: number
    ): Promise<User> {
        return this.userService.findOne({ id });
    }

    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @Query(() => [UserEntity], { name: 'findAllUsers' })
    async findAllUsers(
        @Args() paginationArgs: PaginationArgs
    ): Promise<User[]> {
        return this.userService.findAll(paginationArgs);
    }
}
