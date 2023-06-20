import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDto } from '@user/dtos/user.dto';
import { TokenDto } from './dtos/token.dto';
import { AuthService } from './auth.service';
import { User } from '@user/decorators/user.decorator';
import { RequestPasswordDto } from '@user/dtos/request-password.dto';
import { ResetPasswordDto } from '@user/dtos/reset-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: UserDto): Promise<TokenDto> {
        return this.authService.login(user);
    }

    @Post('reset')
    async resetRequest(@Body(new ValidationPipe()) body: RequestPasswordDto) {
        return this.authService.resetRequest(body);
    }

    @Post('reset/:token')
    async resetHandler(
        @Body(new ValidationPipe()) body: ResetPasswordDto,
        @Param('token') token: string
    ) {
        return this.authService.resetHandler(body, token);
    }
}
