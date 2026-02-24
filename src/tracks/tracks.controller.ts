import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { ProgramRolesGuard } from '../common/guards/program-roles.guard';
import { TrackProgramRolesGuard } from '../common/guards/track-program-roles.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post('programs/:programId/tracks')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  create(
    @Param('programId') programId: string,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    return this.tracksService.create(programId, createTrackDto);
  }

  @Get('programs/:programId/tracks')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findAll(@Param('programId') programId: string) {
    return this.tracksService.findAllForProgram(programId);
  }

  @Get('tracks/:id')
  @UseGuards(TrackProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Patch('tracks/:id')
  @UseGuards(TrackProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete('tracks/:id')
  @UseGuards(TrackProgramRolesGuard)
  @ProgramRoles('ADMIN')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(id);
  }
}
