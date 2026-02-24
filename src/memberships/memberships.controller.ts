import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto, UpdateMembershipDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { ProgramRolesGuard } from '../common/guards/program-roles.guard';

@Controller('programs/:programId/memberships')
@UseGuards(JwtAuthGuard, ProgramRolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @ProgramRoles('COACH', 'ADMIN')
  create(
    @Param('programId') programId: string,
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    return this.membershipsService.create(programId, createMembershipDto);
  }

  @Get()
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findAll(@Param('programId') programId: string) {
    return this.membershipsService.findAllForProgram(programId);
  }

  @Patch(':userId')
  @ProgramRoles('ADMIN')
  update(
    @Param('programId') programId: string,
    @Param('userId') userId: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(programId, userId, updateMembershipDto);
  }

  @Delete(':userId')
  @ProgramRoles('ADMIN')
  remove(
    @Param('programId') programId: string,
    @Param('userId') userId: string,
  ) {
    return this.membershipsService.remove(programId, userId);
  }
}
