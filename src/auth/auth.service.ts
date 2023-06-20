import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '@user/dtos/user.dto';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenDto } from './dtos/token.dto';
import { User } from '@prisma/client';
import { ResetPasswordDto } from '@user/dtos/reset-password.dto';
import { RequestPasswordDto } from '@user/dtos/request-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(
        email: string,
        password: string
    ): Promise<UserDto | false> {
        const user = (await this.userService.findOne({ email }, false)) as User;

        if (!(await bcrypt.compare(password, user.password))) return false;

        return user;
    }

    async login(dto: UserDto): Promise<TokenDto> {
        const payload = { email: dto.email, sub: dto.id, role: dto.role };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

    async resetRequest(dto: RequestPasswordDto) {
        return this.userService.resetRequest(dto.email);
    }

    async resetHandler(dto: ResetPasswordDto, token: string) {
        if (!token || token.length <= 0)
            throw new BadRequestException('Token is invalid');

        return this.userService.resetHandler(dto, token);
    }
}
