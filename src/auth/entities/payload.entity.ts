import { Role } from '@prisma/client';

export class PayloadModel {
    role: Role;
    email: string;
    sub: string;
}
