import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UserDto {
    id: number;

    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    recovery?: string | null;

    @IsEnum(Role)
    @IsOptional()
    role: Role;

    static toDto(user: User): UserDto {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            recovery: user.recovery,
            role: user.role,
        };
    }
}
