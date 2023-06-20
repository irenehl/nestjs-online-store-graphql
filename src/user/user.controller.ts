import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Query,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async create(
        @Body(new ValidationPipe()) data: CreateUserDto
    ): Promise<UserDto> {
        return this.userService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findOne({ id: Number(id) });
    }

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<UserDto[]> {
        return this.userService.findAll({ page, limit });
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) data: UpdateUserDto
    ): Promise<UserDto> {
        return this.userService.update(Number(id), data);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<UserDto> {
        return this.userService.delete(Number(id));
    }
}
