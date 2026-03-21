---
trigger: always_on
---

# FastAPI Backend Development Rules

## Core Philosophy
- You are an Expert System Architect and Backend/AI Engineer. We use FastAPI for its extreme performance, async capabilities, and native synergy with Python's data science ecosystem.
- Priority 1: Architectural clarity. Use a highly modular, domain-driven structure (`/routers`, `/services`, `/models`, `/schemas`).
- Priority 2: Mathematical fidelity. Never use basic `IF/ELSE` chains for core matching or scoring logic. Always use matrix/vector operations (e.g., `numpy`) and mathematical models (Cosine Similarity, Minimax) for data processing.
- Priority 3: Always scan for database-level optimizations. Offload heavy vector computations to the database using PostgreSQL with the `pgvector` extension whenever possible. The computations you need to execute in Python should be reserved for dynamic, multi-variable formulas (like real-time weather + distance + vector similarity).
- Priority 4: No "Utility Noise". Avoid bloated ORM queries, unnecessary middleware, or importing heavy libraries when a built-in Python module suffices.

## Architecture & Routing Rules
- **Structure**: Never put business or algorithmic logic in route handlers (`/routers`). Use routers strictly for request validation, dependency injection, and HTTP response formatting. Push all core logic down to `/services`. 
- **Data Models**: Use SQLAlchemy for ORM mapping (`/models`) and Pydantic for data validation/serialization (`/schemas`). Strictly separate DB models from API schemas. Use `pgvector` types for storing $n$-dimensional preference vectors.
- **State & Caching**: Never use in-memory global variables for state. Use Redis for ephemeral state, rate limiting (e.g., anti-spam for the swipe feature), and caching external API responses (Google Maps, Weather).
- **Async/Await**: Use `async def` for all I/O-bound operations (database calls, external API requests, Redis queries). Use standard `def` or thread pools/background tasks for heavy CPU-bound algorithmic calculations (like Minimax graph routing) to prevent blocking the async event loop.
- **Dependency Injection**: Use FastAPI's `Depends()` for database sessions (`yield db`), current user context, and service instantiations. Never hardcode dependencies or instantiate them globally. This ensures the backend remains highly testable.
- **Error Handling**: Raise customized `HTTPException`s at the service level and let FastAPI handle the standard JSON response. Avoid massive `try/catch` blocks in routers.

## Global Preferences
- Prefer **Service-Oriented Architecture** and strict **TypeScript-like Type Hints** in Python (3.10+). No `Any` types allowed unless interacting with a completely unpredictable third-party webhook.
- Always ensure endpoints are self-documenting. Use FastAPI's native OpenAPI integration by providing descriptive `summary`, `description`, and exact `response_model` fields for every single route.

## Codebase & Architecture Style
- The FastAPI backend has a unique, minimal aesthetic. It emphasizes readability, strict typing, and high performance. Think of modern, enterprise-grade Python microservices.
- Build hierarchy by grouping related domains into their own modules (e.g., `users`, `locations`, `groups`, `algorithms`) rather than dumping all routes into one file and all services into another.
- The general style of the algorithms should be mathematically grounded, simple, and performant. State changes are driven by vector math ($\vec{U}_{new} = \vec{U}_{old} + \alpha \cdot \vec{P}$) rather than disruptive, hard-coded condition mutations.

## Recommendations
- The recommended approach for processing matching logic is using `numpy` arrays. Only diverge to standard Python lists when interacting directly with the SQLAlchemy ORM or formatting the final JSON response.
- Only use `BackgroundTasks` for non-critical side effects (e.g., logging metrics, updating an asynchronous cache). Do not use them for the core vector updating logic if the user needs the next recommendation immediately based on their previous swipe.
- Adding pagination to list endpoints is mandatory. Never return an unbounded `SELECT *` query. Use `limit`/`offset` or cursor-based pagination for endpoints like `/api/recommendations`.
- Adding `Depends(get_current_user)` to a router will make ALL nested operations assume authentication. It can have unintended effects if you need a public fallback. For endpoints that behave differently for guests vs. logged-in users, make the user dependency optional and handle the logic inside the service.