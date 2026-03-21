---
description: Run Project Tests
---

# Role & Workflow Objective
You are the Lead QA & Test Automation Engineer. Your task is to execute **Workflow 02: Testing Infrastructure**. 
Your goal is to establish a robust, isolated testing environment for both the FastAPI backend and the Next.js frontend, and to write the first set of algorithmic unit tests based on our mathematical models.

# Strict Execution Rules
1. **Test-Driven Philosophy:** You are setting up the harness. You will write tests for the math algorithms *before* the backend team implements the full API routes.
2. **Isolation:** Backend tests must never write to the production database. You must configure a separate test database or use transactions that rollback. External APIs (Google Maps, Weather) and Redis must be mocked.
3. **Execution:** Use your terminal to install necessary testing libraries and run the test suites to ensure the configuration works.

---

## Step 1: Backend Testing Setup (FastAPI + Pytest)
1. Navigate to the `/backend` directory.
2. Install testing dependencies: `pytest`, `pytest-asyncio`, `httpx` (for async API testing), `pytest-cov` (for coverage), and `fakeredis` (to mock Redis).
3. Create a `/backend/tests` directory with an `__init__.py`.
4. Create `/backend/tests/conftest.py`. In this file:
   - Configure an async test client using `httpx.AsyncClient`.
   - Override the FastAPI dependency injection to use a separate test PostgreSQL database (e.g., append `_test` to the DB name) and a fake Redis instance.
5. Create a basic API test in `/backend/tests/test_health.py` to ensure the `GET /api/health` endpoint created in Workflow 01 returns a `200 OK`.

## Step 2: Algorithmic Unit Tests (The Math Engine)
Create `/backend/tests/test_algorithms.py`. You must write pure `numpy` unit tests for our core formulas. Mock the input data as numpy arrays.
1. **Test Swipe Updater:** Write a test for $\vec{U}_{new} = \vec{U}_{old} + \alpha \cdot \vec{P}$. Assert that the resulting user vector moves closer to the place vector. Test the edge case where $\alpha = 0$ (spam penalty).
2. **Test Contextual Scorer:** Write a test for $Score(S) = W_1 \cdot Sim(\vec{U}, \vec{P}) + W_2 \cdot C_{weather} - W_3 \cdot D$. Provide mock arrays for $U$ and $P$, mock floats for $C_{weather}$ and $D$. Assert that the final score matches the expected manual calculation.
3. **Test Minimax Referee:** Write a test for $\min \left( \max_{i \in \text{Group}} \left| \text{Score}_i - \text{Score}_{ideal} \right| \right)$. Input a matrix of 3 users with divergent preferences and assert that the algorithm selects the most mathematically balanced location index.

*(Note: If the actual algorithm files don't exist yet, create placeholder functions in `/backend/app/services/algorithm.py` that just return dummy data so the tests can run and fail predictably).*

## Step 3: Frontend Testing Setup (Next.js + Vitest/Testing Library)
1. Navigate to the `/frontend` directory.
2. We will use Vitest (faster than Jest for Next.js) and React Testing Library. Install dependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/dom`, `@vitejs/plugin-react`, and `jsdom`.
3. Create a `vitest.config.ts` in the root of `/frontend` to configure the test environment to use `jsdom` and support our `@/*` path aliases.
4. Create `/frontend/src/__tests__/page.test.tsx`.
5. Write a simple render test to verify that the Once UI `<Heading>` (containing "Smart Travel App - Setup Complete") renders successfully on the screen.

## Step 4: Verification & Handoff
1. Run the backend tests: `cd backend && pytest --cov=app`
2. Run the frontend tests: `cd frontend && npx vitest run`
3. If any configuration errors occur, fix them automatically.
4. Once both test suites run successfully (even if the algorithmic tests fail due to missing implementation, which is expected in TDD), output a test summary report.
5. State that the workspace is fully tested and ready for **Workflow 03: Database Schema & Core Feature Implementation**.