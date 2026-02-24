import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(['ATHLETE', 'COACH', 'ADMIN'])
  role?: 'ATHLETE' | 'COACH' | 'ADMIN';
}
