import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMembershipDto, UpdateMembershipDto } from './dto';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async create(programId: string, createMembershipDto: CreateMembershipDto) {
    const existing = await this.prisma.programMembership.findUnique({
      where: {
        userId_programId: {
          userId: createMembershipDto.userId,
          programId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this program');
    }

    return this.prisma.programMembership.create({
      data: {
        userId: createMembershipDto.userId,
        programId,
        role: createMembershipDto.role || 'ATHLETE',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async findAllForProgram(programId: string) {
    return this.prisma.programMembership.findMany({
      where: { programId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: [{ role: 'desc' }, { joinedAt: 'asc' }],
    });
  }

  async update(
    programId: string,
    userId: string,
    updateMembershipDto: UpdateMembershipDto,
  ) {
    const membership = await this.prisma.programMembership.findUnique({
      where: {
        userId_programId: {
          userId,
          programId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return this.prisma.programMembership.update({
      where: {
        userId_programId: {
          userId,
          programId,
        },
      },
      data: updateMembershipDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async remove(programId: string, userId: string) {
    const membership = await this.prisma.programMembership.findUnique({
      where: {
        userId_programId: {
          userId,
          programId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return this.prisma.programMembership.delete({
      where: {
        userId_programId: {
          userId,
          programId,
        },
      },
    });
  }
}
