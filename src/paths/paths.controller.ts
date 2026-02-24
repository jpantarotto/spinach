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
import { PathsService } from './paths.service';
import { CreatePathDto, UpdatePathDto, AssignPathDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { TrackProgramRolesGuard } from '../common/guards/track-program-roles.guard';
import { PathProgramRolesGuard } from '../common/guards/path-program-roles.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class PathsController {
  constructor(private readonly pathsService: PathsService) {}

  @Post('tracks/:trackId/paths')
  @UseGuards(TrackProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  create(
    @Param('trackId') trackId: string,
    @Body() createPathDto: CreatePathDto,
  ) {
    return this.pathsService.create(trackId, createPathDto);
  }

  @Get('tracks/:trackId/paths')
  @UseGuards(TrackProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findAll(@Param('trackId') trackId: string) {
    return this.pathsService.findAllForTrack(trackId);
  }

  @Get('paths/:id')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.pathsService.findOne(id);
  }

  @Patch('paths/:id')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  update(@Param('id') id: string, @Body() updatePathDto: UpdatePathDto) {
    return this.pathsService.update(id, updatePathDto);
  }

  @Delete('paths/:id')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('ADMIN')
  remove(@Param('id') id: string) {
    return this.pathsService.remove(id);
  }

  @Post('paths/:id/assign')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  assign(@Param('id') id: string, @Body() assignPathDto: AssignPathDto) {
    return this.pathsService.assignAthlete(id, assignPathDto.athleteId);
  }

  @Delete('paths/:id/assign/:athleteId')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  unassign(@Param('id') id: string, @Param('athleteId') athleteId: string) {
    return this.pathsService.unassignAthlete(id, athleteId);
  }
}
