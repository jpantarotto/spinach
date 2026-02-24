-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('USER', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "ProgramRole" AS ENUM ('ATHLETE', 'COACH', 'ADMIN');

-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('SETS_REPS', 'AMRAP', 'FOR_TIME', 'MAX_LOAD', 'DISTANCE', 'CALORIES', 'TIME', 'ROUNDS_REPS', 'PASS_FAIL');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('YOUTH', 'ADULT', 'MASTERS');

-- CreateEnum
CREATE TYPE "PregnancyStatus" AS ENUM ('NONE', 'PRE_PARTUM', 'POST_PARTUM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "global_role" "GlobalRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "program_id" TEXT NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_paths" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "track_id" TEXT NOT NULL,
    "age_group" "AgeGroup",
    "pregnancy_status" "PregnancyStatus",
    "injury_accommodations" TEXT[],

    CONSTRAINT "track_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "path_assignments" (
    "id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "athlete_id" TEXT NOT NULL,
    "track_path_id" TEXT NOT NULL,

    CONSTRAINT "path_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_profiles" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "age_group" "AgeGroup",
    "pregnancy_status" "PregnancyStatus" NOT NULL DEFAULT 'NONE',
    "injuries" TEXT[],

    CONSTRAINT "athlete_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_memberships" (
    "id" TEXT NOT NULL,
    "role" "ProgramRole" NOT NULL DEFAULT 'ATHLETE',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,

    CONSTRAINT "program_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "video_url" TEXT,
    "default_measure_type" "MeasureType" NOT NULL DEFAULT 'SETS_REPS',
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "program_id" TEXT,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "date" DATE NOT NULL,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "track_path_id" TEXT NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "measure_type" "MeasureType" NOT NULL,
    "target_values" JSONB,
    "notes" TEXT,
    "workout_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_results" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "rpe" INTEGER,
    "workout_id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,

    CONSTRAINT "workout_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_results" (
    "id" TEXT NOT NULL,
    "actual_values" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workout_result_id" TEXT NOT NULL,
    "workout_exercise_id" TEXT NOT NULL,

    CONSTRAINT "exercise_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "path_assignments_athlete_id_track_path_id_key" ON "path_assignments"("athlete_id", "track_path_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_profiles_user_id_key" ON "athlete_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "program_memberships_user_id_program_id_key" ON "program_memberships"("user_id", "program_id");

-- CreateIndex
CREATE INDEX "workouts_track_path_id_date_idx" ON "workouts"("track_path_id", "date");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_paths" ADD CONSTRAINT "track_paths_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_assignments" ADD CONSTRAINT "path_assignments_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_assignments" ADD CONSTRAINT "path_assignments_track_path_id_fkey" FOREIGN KEY ("track_path_id") REFERENCES "track_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_profiles" ADD CONSTRAINT "athlete_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_memberships" ADD CONSTRAINT "program_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_memberships" ADD CONSTRAINT "program_memberships_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_track_path_id_fkey" FOREIGN KEY ("track_path_id") REFERENCES "track_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_results" ADD CONSTRAINT "workout_results_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_results" ADD CONSTRAINT "workout_results_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_workout_result_id_fkey" FOREIGN KEY ("workout_result_id") REFERENCES "workout_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_results" ADD CONSTRAINT "exercise_results_workout_exercise_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
