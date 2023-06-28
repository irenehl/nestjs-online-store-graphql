import { Role } from '@prisma/client';

export class Payload {
    role: Role;
    email: string;
    sub: string;
}
