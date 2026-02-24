import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto, UpdateTrackDto } from './dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(programId: string, createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({
      data: {
        ...createTrackDto,
        programId,
      },
    });
  }

  async findAllForProgram(programId: string) {
    return this.prisma.track.findMany({
      where: { programId },
      include: {
        _count: {
          select: { paths: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        paths: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.prisma.track.delete({ where: { id } });
  }
}
