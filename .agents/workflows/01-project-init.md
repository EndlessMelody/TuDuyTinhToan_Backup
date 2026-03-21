---
description: Initialize Project Scaffolding
---

# Role & Workflow Objective
You are the Lead DevOps and Full-Stack Architect. Your current task is to execute **Workflow 01: Project Initialization**. 
Your goal is to scaffold the actual application environments for both the frontend and backend, set up the Docker infrastructure, and ensure both servers can start and communicate. 

# Strict Execution Rules
1. **No Logic Yet:** Do NOT write any core features, algorithms, or database schemas during this workflow. This is strictly for environment setup and health checks.
2. **Step-by-Step:** You must complete the steps in exact order.
3. **Terminal Commands:** Use your terminal execution capabilities to run commands, install dependencies, and create files.

---

## Step 1: Infrastructure Setup (Docker)
We need a local database and cache that support our algorithmic requirements.
1. Create a `docker-compose.yml` file in the root directory.
2. Configure **PostgreSQL with pgvector**: Use the `ankane/pgvector:latest` image (or equivalent) so we have vector math support out of the box. Expose port `5432`.
3. Configure **Redis**: Use the official `redis:alpine` image. Expose port `6379`.
4. Create a `.env` file in the root with default connection strings (e.g., `DATABASE_URL`, `REDIS_URL`).

## Step 2: Backend Initialization (FastAPI)
1. Initialize a Python environment in the `/backend` directory (create a `requirements.txt` or use `poetry`/`pipenv` based on your standard practice).
2. Install the core dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg` (for async database calls), `redis`, `numpy`, and `pgvector`.
3. Scaffold the basic FastAPI structure:
   - Create `/backend/app/main.py`.
   - Set up standard CORS middleware to allow requests from `http://localhost:3000`.
4. Create a simple health check endpoint: `GET /api/health` that returns `{"status": "ok", "service": "Smart Travel API"}`.

## Step 3: Frontend Initialization (Next.js + Once UI Prep)
1. Navigate to the `/frontend` directory.
2. Initialize a Next.js application (App Router, TypeScript, ESLint). *Command: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`*
   *(Note: Once UI uses its own utility system, but we keep Tailwind disabled or restricted purely to layout if Once UI requires it. Strictly follow the `.agent_rules/frontend.md` provided earlier).*
3. Clean up the boilerplate in `src/app/page.tsx` and replace it with a simple Once UI `<Column>` layout containing a `<Heading>` that says "Smart Travel App - Setup Complete".
4. Add a `fetch` call in a `useEffect` (or a Server Component) to ping the backend's `GET /api/health` endpoint and display the status on the screen.

## Step 4: Verification & Handoff
1. Start the Docker containers.
2. Start the FastAPI server on port `8000`.
3. Start the Next.js dev server on port `3000`.
4. Verify that the frontend successfully fetches and displays the backend health status.
5. Once verified, output a success message summarizing the completed infrastructure and state that the workspace is ready for **Workflow 02: Database & Core Models**.