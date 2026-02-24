import { IsString } from 'class-validator';

export class AssignPathDto {
  @IsString()
  athleteId: string;
}
