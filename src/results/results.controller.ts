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
import { ResultsService } from './results.service';
import {
  CreateWorkoutResultDto,
  UpdateWorkoutResultDto,
  CreateExerciseResultDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import type { SafeUser } from '../users/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('workouts/:workoutId/results')
  createWorkoutResult(
    @Param('workoutId') workoutId: string,
    @Body() createDto: CreateWorkoutResultDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.resultsService.createWorkoutResult(workoutId, user.id, createDto);
  }

  @Get('workouts/:workoutId/results')
  findWorkoutResults(@Param('workoutId') workoutId: string) {
    return this.resultsService.findWorkoutResults(workoutId);
  }

  @Get('workouts/:workoutId/results/me')
  findMyWorkoutResult(
    @Param('workoutId') workoutId: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.resultsService.findMyWorkoutResult(workoutId, user.id);
  }

  @Get('results/:id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch('results/:id')
  updateWorkoutResult(
    @Param('id') id: string,
    @Body() updateDto: UpdateWorkoutResultDto,
  ) {
    return this.resultsService.updateWorkoutResult(id, updateDto);
  }

  @Delete('results/:id')
  deleteWorkoutResult(@Param('id') id: string) {
    return this.resultsService.deleteWorkoutResult(id);
  }

  @Post('results/:resultId/exercises')
  addExerciseResult(
    @Param('resultId') resultId: string,
    @Body() createDto: CreateExerciseResultDto,
  ) {
    return this.resultsService.addExerciseResult(resultId, createDto);
  }

  @Patch('exercise-results/:id')
  updateExerciseResult(
    @Param('id') id: string,
    @Body() body: { actualValues: Record<string, unknown>; notes?: string },
  ) {
    return this.resultsService.updateExerciseResult(
      id,
      body.actualValues,
      body.notes,
    );
  }
}
