import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto, UpdateProgramDto } from './dto';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const program = await tx.program.create({
        data: {
          ...createProgramDto,
          createdById: userId,
        },
      });

      // Creator becomes ADMIN of the program
      await tx.programMembership.create({
        data: {
          userId,
          programId: program.id,
          role: 'ADMIN',
        },
      });

      return program;
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.program.findMany({
      where: {
        memberships: {
          some: {
            userId,
            isActive: true,
          },
        },
      },
      include: {
        memberships: {
          where: { userId },
          select: { role: true },
        },
        _count: {
          select: {
            tracks: true,
            memberships: { where: { isActive: true } },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        tracks: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            memberships: { where: { isActive: true } },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto) {
    const program = await this.prisma.program.findUnique({ where: { id } });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return this.prisma.program.update({
      where: { id },
      data: updateProgramDto,
    });
  }

  async remove(id: string) {
    const program = await this.prisma.program.findUnique({ where: { id } });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return this.prisma.program.delete({ where: { id } });
  }
}
