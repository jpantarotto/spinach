import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class UpdateWorkoutResultDto {
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
}
