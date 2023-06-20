import { IsEmail } from 'class-validator';

export class RequestPasswordDto {
    @IsEmail()
    email: string;
}
