import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    static toDto(user: User): CreateUserDto {
        return {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            username: user.password,
            role: user.role,
        };
    }
}
