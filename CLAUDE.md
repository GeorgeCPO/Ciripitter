# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ciripitter is a Romanian Twitter clone built for backend system design practice. There is no frontend — this is a pure HTTP API.

## Commands

```bash
npm run dev              # start server with hot reload (tsx watch)
npm test                 # run all tests once
npm run test:watch       # run tests in watch mode
npm run test:coverage    # run tests with coverage report
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier (write)
npm run format:check     # Prettier (check only, for CI)
npm run db:generate      # generate Drizzle migrations from schema
npm run db:migrate       # apply pending migrations
npm run db:studio        # open Drizzle Studio
```

To run a single test file: `npx vitest run tests/some.test.ts`

## Architecture

`src/index.ts` starts the server. `src/app.ts` exports `buildApp()`, which constructs and returns the Fastify instance without binding to a port — tests import it directly and use `app.inject()`.

## Environment

Copy `.env.example` to `.env` before running. `DATABASE_URL` must be set — the app throws at startup if it is missing.
