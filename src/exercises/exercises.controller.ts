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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { ProgramRolesGuard } from '../common/guards/program-roles.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { SafeUser } from '../users/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  // Global exercises - only superadmins can create
  @Post('exercises')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  createGlobal(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(null, createExerciseDto);
  }

  // Get all global exercises
  @Get('exercises')
  findAllGlobal() {
    return this.exercisesService.findAllGlobal();
  }

  // Program-specific exercises
  @Post('programs/:programId/exercises')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  createForProgram(
    @Param('programId') programId: string,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.create(programId, createExerciseDto);
  }

  @Get('programs/:programId/exercises')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findAllForProgram(@Param('programId') programId: string) {
    return this.exercisesService.findAllForProgram(programId);
  }

  @Get('exercises/:id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  // Update program-specific exercise
  @Patch('programs/:programId/exercises/:id')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  update(
    @Param('programId') programId: string,
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.exercisesService.update(
      id,
      updateExerciseDto,
      user.globalRole,
      programId,
    );
  }

  // Update global exercise (superadmin only)
  @Patch('exercises/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  updateGlobal(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.exercisesService.update(id, updateExerciseDto, user.globalRole);
  }

  // Delete program-specific exercise
  @Delete('programs/:programId/exercises/:id')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ADMIN')
  remove(
    @Param('programId') programId: string,
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.exercisesService.remove(id, user.globalRole, programId);
  }

  // Delete global exercise (superadmin only)
  @Delete('exercises/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  removeGlobal(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    return this.exercisesService.remove(id, user.globalRole);
  }
}
