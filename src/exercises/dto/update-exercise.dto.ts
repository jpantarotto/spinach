import {
  IsString,
  IsOptional,
  IsUrl,
  MinLength,
  IsEnum,
} from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
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
  defaultMeasureType?:
    | 'SETS_REPS'
    | 'AMRAP'
    | 'FOR_TIME'
    | 'MAX_LOAD'
    | 'DISTANCE'
    | 'CALORIES'
    | 'TIME'
    | 'ROUNDS_REPS'
    | 'PASS_FAIL';
}
