import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export class AddWorkoutExerciseDto {
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
