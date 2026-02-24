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
import { ProgramsService } from './programs.service';
import { CreateProgramDto, UpdateProgramDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { ProgramRoles } from '../common/decorators/program-roles.decorator';
import { ProgramRolesGuard } from '../common/guards/program-roles.guard';
import type { SafeUser } from '../users/entities/user.entity';

@Controller('programs')
@UseGuards(JwtAuthGuard)
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.programsService.create(createProgramDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: SafeUser) {
    return this.programsService.findAllForUser(user.id);
  }

  @Get(':id')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ATHLETE', 'COACH', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ADMIN')
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Delete(':id')
  @UseGuards(ProgramRolesGuard)
  @ProgramRoles('ADMIN')
  remove(@Param('id') id: string) {
    return this.programsService.remove(id);
  }
}
