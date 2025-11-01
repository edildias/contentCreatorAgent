# TopVoice Phase 2 Platform

This repository contains the foundational implementation for the TopVoice LinkedIn content automation platform (Phase 2). It is structured as a pnpm monorepo with backend (Express + Prisma) and frontend (Vite + React) workspaces.

## Structure

```
contentCreatorAgent/
├── backend/    # Express API, Prisma schema and automation endpoints
├── frontend/   # React dashboard, Kanban workflow and theme management
├── main.json   # Existing automation flow (Phase 1 reference)
└── package.json
```

## Backend Highlights

- Email/password authentication with JWT
- Theme, post and metrics CRUD endpoints aligned with the PRD
- Automation logging model to track column transitions for N8N integrations
- Prisma schema ready for PostgreSQL with role support and performance snapshots

See [backend/README.md](backend/README.md) for setup instructions.

## Frontend Highlights

- Authenticated workspace with dashboard, posts Kanban, leads placeholder and themes configuration
- React Query data layer using a shared Axios client
- Tailwind-based UI with reusable components for KPIs, charts and Kanban cards

See [frontend/README.md](frontend/README.md) for development commands.

## Getting Started

```bash
pnpm install
pnpm --filter topvoice-backend prisma:generate
pnpm --filter topvoice-backend dev # start API on :4000
pnpm --filter topvoice-frontend dev # start web app on :5173
```

Configure the backend `.env` file before running the API.
