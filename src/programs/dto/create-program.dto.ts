import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
