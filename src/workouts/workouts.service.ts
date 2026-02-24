import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  AddWorkoutExerciseDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(pathId: string, createWorkoutDto: CreateWorkoutDto) {
    const { exercises, date, ...workoutData } = createWorkoutDto;

    return this.prisma.workout.create({
      data: {
        ...workoutData,
        date: new Date(date),
        trackPathId: pathId,
        exercises: exercises
          ? {
              create: exercises.map((ex, index) => ({
                exerciseId: ex.exerciseId,
                sortOrder: ex.sortOrder ?? index,
                measureType: ex.measureType,
                targetValues: ex.targetValues as Prisma.InputJsonValue,
                notes: ex.notes,
              })),
            }
          : undefined,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findByPathAndDate(pathId: string, date: Date) {
    return this.prisma.workout.findMany({
      where: {
        trackPathId: pathId,
        date,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findTodaysWorkouts(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's memberships
    const memberships = await this.prisma.programMembership.findMany({
      where: { userId, isActive: true },
      include: {
        program: {
          include: {
            tracks: {
              where: { isActive: true },
              include: {
                paths: true,
              },
            },
          },
        },
      },
    });

    // Get user's athlete profile
    const profile = await this.prisma.athleteProfile.findUnique({
      where: { userId },
    });

    // Get explicit path assignments
    const assignments = await this.prisma.pathAssignment.findMany({
      where: { athleteId: userId, isActive: true },
      select: { trackPathId: true },
    });
    const assignedPathIds = new Set(assignments.map((a) => a.trackPathId));

    const workouts: Array<{
      program: { id: string; name: string };
      track: { id: string; name: string; color: string | null };
      path: { id: string; name: string };
      workout: Awaited<ReturnType<typeof this.prisma.workout.findFirst>>;
    }> = [];

    for (const membership of memberships) {
      for (const track of membership.program.tracks) {
        // Find the appropriate path for this user in this track
        const matchedPath = this.findMatchingPath(
          track.paths,
          profile,
          assignedPathIds,
        );

        if (matchedPath) {
          // Get today's workouts for this path
          const pathWorkouts = await this.prisma.workout.findMany({
            where: {
              trackPathId: matchedPath.id,
              date: today,
            },
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
                orderBy: { sortOrder: 'asc' },
              },
              results: {
                where: { athleteId: userId },
              },
            },
          });

          for (const workout of pathWorkouts) {
            workouts.push({
              program: {
                id: membership.program.id,
                name: membership.program.name,
              },
              track: {
                id: track.id,
                name: track.name,
                color: track.color,
              },
              path: {
                id: matchedPath.id,
                name: matchedPath.name,
              },
              workout,
            });
          }
        }
      }
    }

    return workouts;
  }

  private findMatchingPath(
    paths: Array<{
      id: string;
      name: string;
      isDefault: boolean;
      ageGroup: string | null;
      pregnancyStatus: string | null;
      injuryAccommodations: string[];
    }>,
    profile: { ageGroup: string | null; pregnancyStatus: string; injuries: string[] } | null,
    assignedPathIds: Set<string>,
  ) {
    // 1. Check explicit assignments first
    const assignedPath = paths.find((p) => assignedPathIds.has(p.id));
    if (assignedPath) return assignedPath;

    // 2. Match based on profile criteria
    if (profile) {
      // Check for injury accommodations match
      if (profile.injuries.length > 0) {
        const injuryPath = paths.find((p) =>
          p.injuryAccommodations.some((acc) =>
            profile.injuries.includes(acc),
          ),
        );
        if (injuryPath) return injuryPath;
      }

      // Check for pregnancy status match (not NONE)
      if (profile.pregnancyStatus !== 'NONE') {
        const pregnancyPath = paths.find(
          (p) => p.pregnancyStatus === profile.pregnancyStatus,
        );
        if (pregnancyPath) return pregnancyPath;
      }

      // Check for age group match
      if (profile.ageGroup) {
        const agePath = paths.find((p) => p.ageGroup === profile.ageGroup);
        if (agePath) return agePath;
      }
    }

    // 3. Fall back to default path
    return paths.find((p) => p.isDefault) || paths[0];
  }

  async findOne(id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
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
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async update(id: string, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const { date, ...rest } = updateWorkoutDto;

    return this.prisma.workout.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return this.prisma.workout.delete({ where: { id } });
  }

  async addExercise(workoutId: string, dto: AddWorkoutExerciseDto) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: dto.exerciseId,
        sortOrder: dto.sortOrder ?? 0,
        measureType: dto.measureType,
        targetValues: dto.targetValues as Prisma.InputJsonValue,
        notes: dto.notes,
      },
      include: {
        exercise: true,
      },
    });
  }

  async removeExercise(workoutExerciseId: string) {
    const workoutExercise = await this.prisma.workoutExercise.findUnique({
      where: { id: workoutExerciseId },
    });

    if (!workoutExercise) {
      throw new NotFoundException('Workout exercise not found');
    }

    return this.prisma.workoutExercise.delete({
      where: { id: workoutExerciseId },
    });
  }
}
