import { Field, InputType, Int } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import { IsString, IsOptional, IsEmail, IsEnum, IsStrongPassword } from "class-validator";

@InputType()
export class UpdateUserInput {
    @Field(() => Int)
    id: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    lastname?: string;

    @Field(() => String, { nullable: true })
    @IsEmail()
    @IsOptional()
    email?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    @IsStrongPassword()
    password?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    username?: string;

    @Field(() => String, { nullable: true })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}