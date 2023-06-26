import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ValidRolesArgs {
    @Field(() => String)
    roles: string;
}