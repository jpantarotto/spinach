import { Global, Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { ProgramRolesGuard } from './guards/program-roles.guard';
import { TrackProgramRolesGuard } from './guards/track-program-roles.guard';
import { PathProgramRolesGuard } from './guards/path-program-roles.guard';

@Global()
@Module({
  providers: [
    RolesGuard,
    ProgramRolesGuard,
    TrackProgramRolesGuard,
    PathProgramRolesGuard,
  ],
  exports: [
    RolesGuard,
    ProgramRolesGuard,
    TrackProgramRolesGuard,
    PathProgramRolesGuard,
  ],
})
export class CommonModule {}
