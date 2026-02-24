import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import type { SafeUser } from '../../users/entities/user.entity';
import {
  ProgramRole,
  PROGRAM_ROLES_KEY,
} from '../decorators/program-roles.decorator';

const ROLE_HIERARCHY: Record<ProgramRole, number> = {
  ATHLETE: 1,
  COACH: 2,
  ADMIN: 3,
};

@Injectable()
export class ProgramRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ProgramRole[]>(
      PROGRAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as SafeUser;

    if (!user) {
      return false;
    }

    // SuperAdmin bypasses all program checks
    if (user.globalRole === 'SUPERADMIN') {
      return true;
    }

    // Get programId from route params
    const programId =
      request.params.programId || request.params.id || request.body?.programId;

    if (!programId) {
      throw new ForbiddenException('Program ID is required');
    }

    const membership = await this.prisma.programMembership.findUnique({
      where: {
        userId_programId: {
          userId: user.id,
          programId,
        },
      },
    });

    if (!membership || !membership.isActive) {
      throw new ForbiddenException('You are not a member of this program');
    }

    // Check if user's role meets the minimum required
    const userRoleLevel = ROLE_HIERARCHY[membership.role as ProgramRole];
    const minRequiredLevel = Math.min(
      ...requiredRoles.map((r) => ROLE_HIERARCHY[r]),
    );

    if (userRoleLevel < minRequiredLevel) {
      throw new ForbiddenException('Insufficient permissions in this program');
    }

    // Attach membership to request for later use
    request.programMembership = membership;

    return true;
  }
}
