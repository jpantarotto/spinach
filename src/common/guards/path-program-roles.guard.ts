import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
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
export class PathProgramRolesGuard implements CanActivate {
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

    // Get pathId from route params
    const pathId = request.params.pathId || request.params.id;

    if (!pathId) {
      throw new ForbiddenException('Path ID is required');
    }

    // Resolve path to track to program
    const path = await this.prisma.trackPath.findUnique({
      where: { id: pathId },
      include: {
        track: {
          select: { programId: true },
        },
      },
    });

    if (!path) {
      throw new NotFoundException('Path not found');
    }

    const programId = path.track.programId;

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

    // Attach membership and programId to request for later use
    request.programMembership = membership;
    request.programId = programId;

    return true;
  }
}
