# Ciripitter

A Romanian Twitter clone. Backend-only, built for system design practice.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify v5
- **Database:** PostgreSQL + Drizzle ORM

## Getting started

```bash
cp .env.example .env   # fill in DATABASE_URL
npm install
npm run db:migrate
npm run dev
```

## Scripts

```bash
npm run dev              # start with hot reload
npm test                 # run tests
npm run lint             # lint
npm run format           # format
npm run db:generate      # generate migrations from schema
npm run db:migrate       # apply migrations
npm run db:studio        # open Drizzle Studio
```
