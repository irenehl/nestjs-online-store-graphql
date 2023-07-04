import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './types/token.type';
import { LoginInput } from './dtos/inputs/login.input';
import { RequestPasswordInput } from '@user/dtos/inputs/request-password.input';
import { ResetPasswordInput } from '@user/dtos/inputs/reset-password.input';
import { User } from '@prisma/client';
import { UserModel } from '@user/models/user.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    // TODO: TokenModel
    @Mutation(() => Token, { name: 'login' })
    async login(@Args('loginInput') loginInput: LoginInput): Promise<Token> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => UserModel, { name: 'resetPasswordRequest' })
    async resetPasswordRequest(
        @Args('requestPasswordInput') requestPasswordInput: RequestPasswordInput
    ): Promise<User> {
        return this.authService.resetRequest(requestPasswordInput);
    }

    @Mutation(() => UserModel, { name: 'setNewPassword' })
    async setNewPassword(
        @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput
    ) {
        return this.authService.resetHandler(resetPasswordInput);
    }
}
