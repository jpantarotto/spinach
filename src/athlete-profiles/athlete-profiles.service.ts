import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAthleteProfileDto } from './dto';

@Injectable()
export class AthleteProfilesService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateForUser(userId: string) {
    let profile = await this.prisma.athleteProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await this.prisma.athleteProfile.create({
        data: { userId },
      });
    }

    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.athleteProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Athlete profile not found');
    }

    return profile;
  }

  async update(userId: string, updateDto: UpdateAthleteProfileDto) {
    // Ensure profile exists
    await this.findOrCreateForUser(userId);

    const data: {
      dateOfBirth?: Date;
      ageGroup?: 'YOUTH' | 'ADULT' | 'MASTERS' | null;
      pregnancyStatus?: 'NONE' | 'PRE_PARTUM' | 'POST_PARTUM';
      injuries?: string[];
    } = {};

    if (updateDto.dateOfBirth !== undefined) {
      data.dateOfBirth = new Date(updateDto.dateOfBirth);
    }
    if (updateDto.ageGroup !== undefined) {
      data.ageGroup = updateDto.ageGroup;
    }
    if (updateDto.pregnancyStatus !== undefined) {
      data.pregnancyStatus = updateDto.pregnancyStatus;
    }
    if (updateDto.injuries !== undefined) {
      data.injuries = updateDto.injuries;
    }

    return this.prisma.athleteProfile.update({
      where: { userId },
      data,
    });
  }

  async getAthleteInProgram(programId: string, athleteId: string) {
    // Verify the athlete is a member of the program
    const membership = await this.prisma.programMembership.findUnique({
      where: {
        userId_programId: {
          userId: athleteId,
          programId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Athlete not found in this program');
    }

    // Get or create profile
    return this.findOrCreateForUser(athleteId);
  }
}
