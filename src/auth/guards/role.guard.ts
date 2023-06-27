import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return false;
        }

        const gqlContext = GqlExecutionContext.create(context);
        const { user } = gqlContext.getContext().req;

        return requiredRoles.some((role) => user.role === role);
    }
}
