import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './types/token.type';
import { LoginInput } from './dtos/inputs/login.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Token)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<Token> {
        return this.authService.login(loginInput);
    }
}
