.\.venv\Scripts\alembic.exe upgrade head

.\.venv\Scripts\python.exe scripts/seed.py

Write-Host "Database setup complete!"
