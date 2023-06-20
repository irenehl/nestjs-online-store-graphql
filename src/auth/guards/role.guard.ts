import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PayloadDto } from '../dtos/payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return false;
        }

        const { user }: { user: PayloadDto } = context
            .switchToHttp()
            .getRequest();

        return requiredRoles.some((role) => user.role === role);
    }
}
