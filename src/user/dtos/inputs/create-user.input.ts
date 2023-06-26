import { Field, InputType } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import { IsString, IsEmail, IsOptional, IsEnum, IsStrongPassword } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => String)
    @IsString()
    lastname: string;

    @Field(() => String)
    @IsString()
    username: string;

    @Field(() => String)
    @IsStrongPassword()
    password: string;

    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    recovery?: string | null;

    @Field(() => String, { nullable: true })
    @IsEnum(Role)
    @IsOptional()
    role: Role;
    
}