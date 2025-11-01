# TopVoice Frontend

The TopVoice frontend is a Vite + React application that delivers the Phase 2 experience: authenticated dashboard, Kanban workflow and theme management.

## Features

- Protected routes with persistent authentication context
- Dashboard with KPI cards, customizable date range and per-theme summaries
- Kanban board that reflects post statuses and opens an editor dialog with scheduling metadata
- Theme creation interface aligned with product pillars
- Axios client with `/api` proxy for local development against the backend

## Development

```bash
pnpm install
pnpm --filter topvoice-frontend dev
```

The development server proxies API requests to `http://localhost:4000`.

## Build

```bash
pnpm --filter topvoice-frontend build
```

A production-ready bundle is emitted to `frontend/dist`.
