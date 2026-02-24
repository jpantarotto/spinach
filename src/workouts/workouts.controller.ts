import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  AddWorkoutExerciseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { PathProgramRolesGuard } from '../common/guards/path-program-roles.guard';
import type { SafeUser } from '../users/entities/user.entity';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';

@Controller()
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get('workouts/today')
  findTodaysWorkouts(@CurrentUser() user: SafeUser) {
    return this.workoutsService.findTodaysWorkouts(user.id);
  }

  @Post('paths/:pathId/workouts')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('COACH', 'ADMIN')
  create(
    @Param('pathId') pathId: string,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(pathId, createWorkoutDto);
  }

  @Get('paths/:pathId/workouts')
  @UseGuards(PathProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findByDate(
    @Param('pathId') pathId: string,
    @Query('date', ParseDatePipe) date: Date,
  ) {
    return this.workoutsService.findByPathAndDate(pathId, date);
  }

  @Get('workouts/:id')
  findOne(@Param('id') id: string) {
    return this.workoutsService.findOne(id);
  }

  @Patch('workouts/:id')
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Delete('workouts/:id')
  remove(@Param('id') id: string) {
    return this.workoutsService.remove(id);
  }

  @Post('workouts/:id/exercises')
  addExercise(
    @Param('id') id: string,
    @Body() addExerciseDto: AddWorkoutExerciseDto,
  ) {
    return this.workoutsService.addExercise(id, addExerciseDto);
  }

  @Delete('workout-exercises/:id')
  removeExercise(@Param('id') id: string) {
    return this.workoutsService.removeExercise(id);
  }
}
