import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMembershipDto {
  @IsOptional()
  @IsEnum(['ATHLETE', 'COACH', 'ADMIN'])
  role?: 'ATHLETE' | 'COACH' | 'ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
