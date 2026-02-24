import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(programId: string | null, createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        ...createExerciseDto,
        programId,
        isGlobal: programId === null,
      },
    });
  }

  async findAllForProgram(programId: string) {
    // Return both global exercises and program-specific exercises
    return this.prisma.exercise.findMany({
      where: {
        OR: [{ isGlobal: true }, { programId }],
      },
      orderBy: [{ isGlobal: 'desc' }, { name: 'asc' }],
    });
  }

  async findAllGlobal() {
    return this.prisma.exercise.findMany({
      where: { isGlobal: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
    userGlobalRole: string,
    programId?: string,
  ) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Only superadmins can modify global exercises
    if (exercise.isGlobal && userGlobalRole !== 'SUPERADMIN') {
      throw new ForbiddenException('Cannot modify global exercises');
    }

    // Non-global exercises must belong to the user's program
    if (!exercise.isGlobal && exercise.programId !== programId) {
      throw new ForbiddenException('Cannot modify exercises from other programs');
    }

    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: string, userGlobalRole: string, programId?: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Only superadmins can delete global exercises
    if (exercise.isGlobal && userGlobalRole !== 'SUPERADMIN') {
      throw new ForbiddenException('Cannot delete global exercises');
    }

    // Non-global exercises must belong to the user's program
    if (!exercise.isGlobal && exercise.programId !== programId) {
      throw new ForbiddenException('Cannot delete exercises from other programs');
    }

    return this.prisma.exercise.delete({ where: { id } });
  }
}
