# Ciripitter

A Romanian Twitter clone. Backend-only, built for system design practice.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify v5
- **Database:** PostgreSQL + Drizzle ORM

## Getting started

```bash
cp .env.example .env
npm install
npm run db:up       # start postgres via Docker
npm run db:migrate  # apply migrations
npm run dev
```

## Database

```bash
npm run db:up        # start postgres (data persisted in Docker volume)
npm run db:down      # stop postgres (data preserved)
npm run db:reset     # stop postgres and wipe the volume
npm run db:generate  # generate migrations from schema
npm run db:migrate   # apply migrations
npm run db:studio    # open Drizzle Studio
```

## Scripts

```bash
npm run dev          # start with hot reload
npm test             # run tests
npm run lint         # lint
npm run format       # format
```
