# Spinach

An athletic programming platform API for managing training programs, workouts, and athlete results.

## Overview

Spinach is a NestJS REST API that lets coaches build structured training programs and athletes track their performance. Programs are organized into tracks → paths → workouts, with per-exercise result logging.

**Key concepts:**

- **Programs** — top-level training programs with role-based membership (Athlete, Coach, Admin)
- **Tracks** — named training tracks within a program (e.g. "Strength", "Conditioning")
- **Paths** — variants within a track, supporting accommodations for age group, pregnancy status, and injury
- **Workouts** — dated sessions assigned to a path, composed of exercises with measure targets
- **Exercises** — reusable movements (global or program-scoped) with flexible measure types (sets/reps, AMRAP, for time, max load, distance, calories, etc.)
- **Results** — per-athlete workout and exercise result logging with RPE tracking

## Tech Stack

- **Framework:** NestJS 11 (TypeScript)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Passport.js with local strategy + JWT
- **Validation:** class-validator / class-transformer

## Prerequisites

- Node.js 20+
- PostgreSQL

## Setup

```bash
npm install
```

Create a `.env.development` (or `.env`) file:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/spinach"
JWT_SECRET="your-secret"
```

Run database migrations:

```bash
npx prisma migrate dev
```

## Running

```bash
# development (watch mode)
npm run start:dev

# production
npm run build && npm run start:prod
```

## API

All routes except `/auth/register` and `/auth/login` require a JWT Bearer token.

### Auth

| Method | Endpoint         | Description       |
|--------|------------------|-------------------|
| POST   | /auth/register   | Create an account |
| POST   | /auth/login      | Get a JWT token   |

### Programs

| Method | Endpoint          | Role required     |
|--------|-------------------|-------------------|
| POST   | /programs         | Authenticated     |
| GET    | /programs         | Authenticated     |
| GET    | /programs/:id     | Member (any role) |
| PATCH  | /programs/:id     | Program Admin     |
| DELETE | /programs/:id     | Program Admin     |

### Other Resources

All resources follow standard CRUD patterns under their respective routes:

- `/memberships` — manage program membership and roles
- `/tracks` — tracks within a program
- `/paths` — path variants within a track
- `/workouts` — dated workout sessions
- `/exercises` — exercise library
- `/results` — workout and exercise results
- `/athlete-profiles` — athlete demographic and accommodation data

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```
