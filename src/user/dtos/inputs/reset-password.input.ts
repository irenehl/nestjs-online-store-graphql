import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class ResetPasswordInput {
    @Field(() => String)
    @IsStrongPassword()
    password: string;

    @Field(() => String)
    @IsString()
    token: string;
}
