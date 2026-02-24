import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePathDto, UpdatePathDto } from './dto';

@Injectable()
export class PathsService {
  constructor(private prisma: PrismaService) {}

  async create(trackId: string, createPathDto: CreatePathDto) {
    return this.prisma.trackPath.create({
      data: {
        ...createPathDto,
        trackId,
      },
    });
  }

  async findAllForTrack(trackId: string) {
    return this.prisma.trackPath.findMany({
      where: { trackId },
      include: {
        _count: {
          select: {
            workouts: true,
            assignments: { where: { isActive: true } },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const path = await this.prisma.trackPath.findUnique({
      where: { id },
      include: {
        track: {
          select: {
            id: true,
            name: true,
            programId: true,
          },
        },
        assignments: {
          where: { isActive: true },
          include: {
            athlete: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!path) {
      throw new NotFoundException('Path not found');
    }

    return path;
  }

  async update(id: string, updatePathDto: UpdatePathDto) {
    const path = await this.prisma.trackPath.findUnique({ where: { id } });

    if (!path) {
      throw new NotFoundException('Path not found');
    }

    return this.prisma.trackPath.update({
      where: { id },
      data: updatePathDto,
    });
  }

  async remove(id: string) {
    const path = await this.prisma.trackPath.findUnique({ where: { id } });

    if (!path) {
      throw new NotFoundException('Path not found');
    }

    return this.prisma.trackPath.delete({ where: { id } });
  }

  async assignAthlete(pathId: string, athleteId: string) {
    const existing = await this.prisma.pathAssignment.findUnique({
      where: {
        athleteId_trackPathId: {
          athleteId,
          trackPathId: pathId,
        },
      },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Athlete is already assigned to this path');
      }

      // Reactivate the assignment
      return this.prisma.pathAssignment.update({
        where: { id: existing.id },
        data: { isActive: true, assignedAt: new Date() },
        include: {
          athlete: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });
    }

    return this.prisma.pathAssignment.create({
      data: {
        athleteId,
        trackPathId: pathId,
      },
      include: {
        athlete: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async unassignAthlete(pathId: string, athleteId: string) {
    const assignment = await this.prisma.pathAssignment.findUnique({
      where: {
        athleteId_trackPathId: {
          athleteId,
          trackPathId: pathId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return this.prisma.pathAssignment.update({
      where: { id: assignment.id },
      data: { isActive: false },
    });
  }
}
