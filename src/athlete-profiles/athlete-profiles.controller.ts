import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AthleteProfilesService } from './athlete-profiles.service';
import { UpdateAthleteProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { ProgramRolesGuard } from '../common/guards/program-roles.guard';
import type { SafeUser } from '../users/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class AthleteProfilesController {
  constructor(
    private readonly athleteProfilesService: AthleteProfilesService,
  ) {}

  @Get('me/profile')
  getMyProfile(@CurrentUser() user: SafeUser) {
    return this.athleteProfilesService.findOrCreateForUser(user.id);
  }

  @Put('me/profile')
  updateMyProfile(
    @CurrentUser() user: SafeUser,
    @Body() updateDto: UpdateAthleteProfileDto,
  ) {
    return this.athleteProfilesService.update(user.id, updateDto);
  }

  @Get('programs/:programId/athletes/:athleteId/profile')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  getAthleteProfile(
    @Param('programId') programId: string,
    @Param('athleteId') athleteId: string,
  ) {
    return this.athleteProfilesService.getAthleteInProgram(programId, athleteId);
  }
}
