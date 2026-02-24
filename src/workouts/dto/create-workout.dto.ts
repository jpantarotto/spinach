import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsDateString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @IsString()
  exerciseId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsEnum([
    'SETS_REPS',
    'AMRAP',
    'FOR_TIME',
    'MAX_LOAD',
    'DISTANCE',
    'CALORIES',
    'TIME',
    'ROUNDS_REPS',
    'PASS_FAIL',
  ])
  measureType:
    | 'SETS_REPS'
    | 'AMRAP'
    | 'FOR_TIME'
    | 'MAX_LOAD'
    | 'DISTANCE'
    | 'CALORIES'
    | 'TIME'
    | 'ROUNDS_REPS'
    | 'PASS_FAIL';

  @IsOptional()
  targetValues?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];
}
