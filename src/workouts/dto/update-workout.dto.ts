import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsDateString,
} from 'class-validator';

export class UpdateWorkoutDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}
