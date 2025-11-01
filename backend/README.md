# TopVoice Backend

The TopVoice backend provides authentication, content management and automation APIs for the Phase 2 platform. It is built with Express, Prisma and PostgreSQL.

## Features

- Email/password authentication with JWT sessions
- Theme CRUD endpoints with per-user isolation
- Post management with Kanban statuses, scheduling metadata and automation event logging
- Metrics aggregation endpoints for the dashboard with theme level breakdown
- Automation event ingestion endpoint for downstream N8N workflows

## Getting Started

1. Install dependencies and generate the Prisma client:

```bash
pnpm install
pnpm --filter topvoice-backend prisma:generate
```

2. Create a `.env` file using the provided `.env.example` template and update the `DATABASE_URL`.

3. Apply migrations and start the development server:

```bash
pnpm --filter topvoice-backend prisma:migrate
pnpm --filter topvoice-backend dev
```

The server exposes a `/health` endpoint along with JSON APIs under `/auth`, `/themes`, `/posts`, `/metrics` and `/automations`.

## Testing

Unit tests can be executed with:

```bash
pnpm --filter topvoice-backend test
```

Vitest is configured for future test coverage of controllers and services.
