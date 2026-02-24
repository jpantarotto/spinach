import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProgramsModule } from './programs/programs.module';
import { MembershipsModule } from './memberships/memberships.module';
import { TracksModule } from './tracks/tracks.module';
import { PathsModule } from './paths/paths.module';
import { AthleteProfilesModule } from './athlete-profiles/athlete-profiles.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    PrismaModule,
    CommonModule,
    UsersModule,
    AuthModule,
    ProgramsModule,
    MembershipsModule,
    TracksModule,
    PathsModule,
    AthleteProfilesModule,
    ExercisesModule,
    WorkoutsModule,
    ResultsModule,
  ],
})
export class AppModule {}
