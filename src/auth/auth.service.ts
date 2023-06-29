import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcrypt';
import { ResetPasswordInput } from '@user/dtos/inputs/reset-password.input';
import { RequestPasswordInput } from '@user/dtos/inputs/request-password.input';
import { LoginInput } from './dtos/inputs/login.input';
import { Token } from './types/token.type';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async login({ email, password }: LoginInput): Promise<Token> {
        const user = await this.userService.findOne({ email });

        if (!(await bcrypt.compare(password, user.password)))
            throw new UnauthorizedException('Wrong credentials');

        const payload = { email, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

    async resetRequest({ email }: RequestPasswordInput): Promise<User> {
        const sendEmail = await this.userService.resetRequest(email);

        if (!sendEmail) throw new BadRequestException('Something went wrong');

        return this.userService.findOne({ email });
    }

    async resetHandler(data: ResetPasswordInput, token: string) {
        if (!token || token.length <= 0)
            throw new BadRequestException('Token is invalid');

        const user = await this.userService.resetHandler(data, token);

        if (!user) throw new BadRequestException('Something went wrong');

        return user;
    }
}
