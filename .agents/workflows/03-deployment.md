---
description: Build and Deploy Project
---

# Role & Workflow Objective
You are the Lead DevOps and Cloud Architect. Your task is to execute **Workflow 03: Deployment & CI/CD Setup**.
Your goal is to prepare the application for production by creating production-ready Dockerfiles, configuring CI/CD pipelines via GitHub Actions, and setting up Infrastructure as Code (IaC) configurations.

# Strict Execution Rules
1. **No Feature Coding:** Do not implement business logic. Focus entirely on DevOps, containerization, and deployment pipelines.
2. **Production Grade:** The Dockerfiles must be optimized (multi-stage builds, non-root users) and the CI/CD pipeline must enforce our testing standards from Workflow 02.
3. **Execution:** Use terminal commands to create the necessary `.github`, `docker`, and deployment configuration files.

---

## Step 1: CI/CD Pipeline (GitHub Actions)
1. Create the directory `.github/workflows`.
2. Create `.github/workflows/ci-cd.yml`.
3. Define two primary jobs in the YAML file:
   - **Frontend Job:** Runs on `ubuntu-latest`. Checks out the code, installs Node.js, runs `npm install`, runs ESLint, and executes `npx vitest run`.
   - **Backend Job:** Runs on `ubuntu-latest`. Sets up Python 3.10+, installs dependencies. Crucially, configure **Service Containers** within the GitHub Action to spin up a `postgres:latest` (with pgvector if possible, or standard for basic health tests) and a `redis:alpine` instance. Then, execute `pytest --cov=app`.
4. Ensure the workflow triggers on `push` and `pull_request` to the `main` branch.

## Step 2: Production Dockerization (Backend)
The local `docker-compose.yml` from Workflow 01 is for development. We need a standalone, optimized Dockerfile for the FastAPI backend to deploy to cloud platforms (like Render, Railway, or AWS).
1. Navigate to the `/backend` directory.
2. Create a production `Dockerfile`.
   - Use a slim Python 3.10+ base image (e.g., `python:3.10-slim`).
   - Implement multi-stage building if necessary to keep the final image size small (especially important since `numpy` and data science libraries can be heavy).
   - Do NOT run the application as the `root` user. Create a dedicated `appuser`.
   - Command to run: Use `gunicorn` with `uvicorn` workers for production performance (e.g., `CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]`).
3. Create a `gunicorn_conf.py` file alongside it to configure worker counts dynamically based on CPU cores.

## Step 3: Deployment Configurations (Infrastructure as Code)
Prepare the configuration files for our chosen cloud providers.
1. **Frontend (Vercel):** Create a `vercel.json` in the root directory (if custom routing or headers are needed). Otherwise, ensure the `build` script in `package.json` is strictly set to `next build`.
2. **Backend/Database (Render/Railway):** Create a `render.yaml` or equivalent configuration file in the root. 
   - Define a Web Service for the FastAPI Docker container.
   - Define environment variables placeholders (`DATABASE_URL`, `REDIS_URL`, `CORS_ORIGINS`).

## Step 4: Verification & Handoff
1. Review the generated `.github/workflows/ci-cd.yml` to ensure matrix routing and service dependencies are syntactically correct.
2. Build the backend Docker image locally to verify it compiles: `cd backend && docker build -t smart-travel-backend:prod .`
3. Output a brief Deployment Strategy guide, explaining to the human user how to connect the GitHub repository to Vercel (Frontend) and Render/Railway/Supabase (Backend + DB).
4. State that the infrastructure is fully automated and the workspace is ready for **Workflow 04: Database Schema & Vector Matching Implementation**.