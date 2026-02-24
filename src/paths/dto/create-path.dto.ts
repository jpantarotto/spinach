import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';

export class CreatePathDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(['YOUTH', 'ADULT', 'MASTERS'])
  ageGroup?: 'YOUTH' | 'ADULT' | 'MASTERS';

  @IsOptional()
  @IsEnum(['NONE', 'PRE_PARTUM', 'POST_PARTUM'])
  pregnancyStatus?: 'NONE' | 'PRE_PARTUM' | 'POST_PARTUM';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  injuryAccommodations?: string[];
}
