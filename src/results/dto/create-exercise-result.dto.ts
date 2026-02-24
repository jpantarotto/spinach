import { IsString, IsOptional } from 'class-validator';

export class CreateExerciseResultDto {
  @IsString()
  workoutExerciseId: string;

  @IsOptional()
  actualValues?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}
