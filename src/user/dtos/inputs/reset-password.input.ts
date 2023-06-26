import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';

@InputType()
export class ResetPasswordInput {
    @Field(() => String)
    @IsStrongPassword()
    password: string;
}
