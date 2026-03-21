# Database Schema Design

## Users
- `id` (UUID, PK)
- `name` (VARCHAR)
- `preferences_vector` (VECTOR(384)) - Embeddings of travel style

## Locations
- `id` (UUID, PK)
- `title` (VARCHAR)
- `coordinates` (POINT)
- `feature_vector` (VECTOR(384)) - Embeddings of location characteristics

## Swipes
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `location_id` (UUID, FK)
- `liked` (BOOLEAN)
- `timestamp` (TIMESTAMPTZ)
