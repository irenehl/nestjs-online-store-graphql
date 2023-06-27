import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './types/token.type';
import { LoginInput } from './dtos/inputs/login.input';
import { RequestPasswordInput } from '@user/dtos/inputs/request-password.input';
import { ResetPasswordInput } from '@user/dtos/inputs/reset-password.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Token)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<Token> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => Boolean, { name: 'resetPasswordRequest' })
    async resetRequest(
        @Args('requestPasswordInput') requestPasswordInput: RequestPasswordInput
    ): Promise<boolean> {
        return this.authService.resetRequest(requestPasswordInput);
    }

    @Mutation(() => String, { name: 'setNewPassword' })
    async resetHandler(
        @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
        @Args('token') token: string
    ) {
        return this.authService.resetHandler(resetPasswordInput, token);
    }
}
