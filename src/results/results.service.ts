import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkoutResultDto,
  UpdateWorkoutResultDto,
  CreateExerciseResultDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async createWorkoutResult(
    workoutId: string,
    athleteId: string,
    dto: CreateWorkoutResultDto,
  ) {
    const { exerciseResults, startedAt, completedAt, ...resultData } = dto;

    return this.prisma.workoutResult.create({
      data: {
        ...resultData,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        completedAt: completedAt ? new Date(completedAt) : undefined,
        workoutId,
        athleteId,
        exerciseResults: exerciseResults
          ? {
              create: exerciseResults.map((er) => ({
                workoutExerciseId: er.workoutExerciseId,
                actualValues: er.actualValues as Prisma.InputJsonValue,
                notes: er.notes,
              })),
            }
          : undefined,
      },
      include: {
        exerciseResults: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });
  }

  async findWorkoutResults(workoutId: string, athleteId?: string) {
    return this.prisma.workoutResult.findMany({
      where: {
        workoutId,
        ...(athleteId && { athleteId }),
      },
      include: {
        athlete: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        exerciseResults: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findMyWorkoutResult(workoutId: string, athleteId: string) {
    return this.prisma.workoutResult.findFirst({
      where: {
        workoutId,
        athleteId,
      },
      include: {
        exerciseResults: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.workoutResult.findUnique({
      where: { id },
      include: {
        workout: {
          include: {
            trackPath: {
              include: {
                track: {
                  select: {
                    id: true,
                    name: true,
                    programId: true,
                  },
                },
              },
            },
          },
        },
        athlete: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        exerciseResults: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Workout result not found');
    }

    return result;
  }

  async updateWorkoutResult(id: string, dto: UpdateWorkoutResultDto) {
    const result = await this.prisma.workoutResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Workout result not found');
    }

    const { startedAt, completedAt, ...rest } = dto;

    return this.prisma.workoutResult.update({
      where: { id },
      data: {
        ...rest,
        ...(startedAt && { startedAt: new Date(startedAt) }),
        ...(completedAt && { completedAt: new Date(completedAt) }),
      },
      include: {
        exerciseResults: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });
  }

  async addExerciseResult(
    workoutResultId: string,
    dto: CreateExerciseResultDto,
  ) {
    const workoutResult = await this.prisma.workoutResult.findUnique({
      where: { id: workoutResultId },
    });

    if (!workoutResult) {
      throw new NotFoundException('Workout result not found');
    }

    return this.prisma.exerciseResult.create({
      data: {
        workoutResultId,
        workoutExerciseId: dto.workoutExerciseId,
        actualValues: dto.actualValues as Prisma.InputJsonValue,
        notes: dto.notes,
      },
      include: {
        workoutExercise: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async updateExerciseResult(
    id: string,
    actualValues: Record<string, unknown>,
    notes?: string,
  ) {
    const result = await this.prisma.exerciseResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Exercise result not found');
    }

    return this.prisma.exerciseResult.update({
      where: { id },
      data: {
        actualValues: actualValues as Prisma.InputJsonValue,
        ...(notes !== undefined && { notes }),
      },
      include: {
        workoutExercise: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async deleteWorkoutResult(id: string) {
    const result = await this.prisma.workoutResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Workout result not found');
    }

    return this.prisma.workoutResult.delete({ where: { id } });
  }
}
