import { registerEnumType } from "@nestjs/graphql";

export enum Role {
    MANAGER = 'MANAGER',
    CLIENT = 'CLIENT'
}

registerEnumType( Role, { name: 'Role' })
