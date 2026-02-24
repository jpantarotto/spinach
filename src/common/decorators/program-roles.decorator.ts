import { SetMetadata } from '@nestjs/common';

export type ProgramRole = 'ATHLETE' | 'COACH' | 'ADMIN';

export const PROGRAM_ROLES_KEY = 'programRoles';
export const ProgramRoles = (...roles: ProgramRole[]) =>
  SetMetadata(PROGRAM_ROLES_KEY, roles);
