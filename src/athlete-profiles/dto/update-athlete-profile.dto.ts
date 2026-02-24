import {
  IsOptional,
  IsEnum,
  IsArray,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdateAthleteProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['YOUTH', 'ADULT', 'MASTERS'])
  ageGroup?: 'YOUTH' | 'ADULT' | 'MASTERS' | null;

  @IsOptional()
  @IsEnum(['NONE', 'PRE_PARTUM', 'POST_PARTUM'])
  pregnancyStatus?: 'NONE' | 'PRE_PARTUM' | 'POST_PARTUM';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  injuries?: string[];
}
