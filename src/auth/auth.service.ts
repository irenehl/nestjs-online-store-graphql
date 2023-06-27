import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenDto } from './dtos/token.dto';
import { ResetPasswordInput } from '@user/dtos/inputs/reset-password.input';
import { RequestPasswordInput } from '@user/dtos/inputs/request-password.input';
import { LoginInput } from './dtos/inputs/login.input';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async login({ email, password }: LoginInput): Promise<TokenDto> {
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

    async resetRequest(dto: RequestPasswordInput) {
        return this.userService.resetRequest(dto.email);
    }

    async resetHandler(dto: ResetPasswordInput, token: string) {
        if (!token || token.length <= 0)
            throw new BadRequestException('Token is invalid');

        return this.userService.resetHandler(dto, token);
    }
}
