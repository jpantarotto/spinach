import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseResultDto {
  @IsString()
  workoutExerciseId: string;

  @IsOptional()
  actualValues?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutResultDto {
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseResultDto)
  exerciseResults?: ExerciseResultDto[];
}
