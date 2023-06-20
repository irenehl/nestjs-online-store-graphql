import { Role } from '@prisma/client';

export class PayloadDto {
    role: Role;
    email: string;
    sub: string;
}
