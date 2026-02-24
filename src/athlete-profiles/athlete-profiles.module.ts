import { Module } from '@nestjs/common';
import { AthleteProfilesService } from './athlete-profiles.service';
import { AthleteProfilesController } from './athlete-profiles.controller';

@Module({
  controllers: [AthleteProfilesController],
  providers: [AthleteProfilesService],
  exports: [AthleteProfilesService],
})
export class AthleteProfilesModule {}
