# CraftFlow — Full-Stack Crafting & Combat Game
React • Node.js (Express) • PostgreSQL • SQL Stored Procedures • Docker

CraftFlow is a full-stack crafting and combat game powered by a server-authoritative PostgreSQL backend. All core gameplay logic — crafting, resource deduction, spawning, combat, and progression — is implemented in SQL using stored procedures, triggers, and row-level locking to guarantee deterministic, consistent, and conflict-free state updates.

The system includes 100+ items, 20+ multi-step crafting flows, and 3–5 level deep recipe chains, materialized into a 300+ row recipe-closure table for instant craftability resolution. CraftFlow supports both manual setup and a fully containerized execution environment via Docker Compose.

---

## Overview

- Multi-step crafting and item upgrading
- Real-time inventory state management
- Material spawning and collection loops
- Monster and dragon combat
- Structured recipe graph with deep dependencies
- Responsive React interface (Vite)
- Fully reproducible Docker-based environment

All gameplay actions (crafting, collecting, attacking) are validated and executed through PostgreSQL stored procedures with row-level locking, ensuring atomicity and preventing client-side manipulation.

---

## Key Features

### Gameplay
- Collect materials → craft items → upgrade tiers → fight enemies
- 100+ items and materials
- 20+ multi-step crafting recipes
- Real-time React UI with crafting modals, inventory panels, HUD, and hotbar
- Spawn zones and collectible materials
- Monster and dragon combat interactions

### Database-Centric Crafting Engine
- 3–5 level deep recipe chains
- Materialized recipe-closure table (300+ rows)
- Instant dependency resolution without recursive CTEs
- Query-optimized with targeted indexes

### Transaction-Safe Crafting Pipeline
- Stored procedures (e.g., `craft_item_locked`)
- SQL triggers for queues, logs, and consistency enforcement
- Row-level locks to guarantee atomic updates
- Server-authoritative validation for all player actions

### Frontend
- React + Vite for fast UI rendering
- Zustand for global state management
- Tailwind CSS for styling (optional)
- 20+ modular UI components

---

## Tech Stack

- Frontend: React, Vite, Zustand
- Backend: Node.js (Express)
- Database: PostgreSQL
- Logic: SQL procedures, triggers, row-level locking
- Containerization: Docker, Docker Compose
- Assets: Pixel-art sprites for items & monsters

---

## All-in-One: Run Locally (Docker recommended)
This single section contains both Docker and manual instructions — run whichever you prefer.

### Option A — Full stack with Docker Compose (recommended)
1) Clone repository:

```powershell
git clone https://github.com/<your-username>/craftflow.git
cd craftflow
```

2) Build and run everything:

```powershell
docker compose up --build
```

What this does:

- Builds backend & frontend images
- Launches PostgreSQL and runs any init/seed scripts included in the container entrypoint or init volume
- Starts backend (Express) and frontend (Vite) services

Access:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

(Postgres runs inside the postgres container; credentials come from your `docker-compose.yml`.)

To stop and remove containers:

```powershell
docker compose down
```

### Option B — Manual setup (no Docker)

1) Clone repository:

```powershell
git clone https://github.com/<your-username>/craftflow.git
cd craftflow
```

2) Database — create DB & run schema/seed:

```powershell
# ensure PostgreSQL is running locally and you have psql access
psql -U postgres -f db/init/00-schema.sql
psql -U postgres -f db/init/16-reset-and-seed-100-items.sql
```

3) Backend:

```powershell
cd backend
npm install
# set environment variables as needed (e.g., DATABASE_URL)
npm run dev
```

Default backend URL: http://localhost:3000 (adjust if your env differs)

4) Frontend:

```powershell
cd ../frontend
npm install
npm run dev
```

Default frontend URL: http://localhost:5173 (Vite default; it will report actual URL in terminal)

