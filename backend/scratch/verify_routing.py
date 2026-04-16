import asyncio
import httpx
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"
AUTH_TOKEN = "your_test_token_here" # In a real test, I'd fetch this or use a test bypass

async def verify_challenges_api():
    print("--- Verifying Challenges Module Routing ---")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # 1. Verify /challenges/me
        print("Checking GET /challenges/me...")
        try:
            res = await client.get(f"{BASE_URL}/challenges/me")
            print(f"Status: {res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print("Data Sample:", str(data)[:100])
            elif res.status_code == 404:
                print("ERROR: /challenges/me still returning 404!")
            elif res.status_code == 401:
                print("SUCCESS: Route exists (Returned 401)")
        except Exception as e:
            print(f"Request failed: {e}")

        # 2. Verify /challenges/leaderboard
        print("\nChecking GET /challenges/leaderboard...")
        res = await client.get(f"{BASE_URL}/challenges/leaderboard?period=alltime")
        print(f"Status: {res.status_code}")
        if res.status_code == 404:
            print("ERROR: /challenges/leaderboard still returning 404!")
        elif res.status_code == 200 or res.status_code == 401:
            print("SUCCESS: Route exists")

        # 3. Verify /challenges/xp/me
        print("\nChecking GET /challenges/xp/me...")
        res = await client.get(f"{BASE_URL}/challenges/xp/me")
        print(f"Status: {res.status_code}")
        if res.status_code == 404:
            print("ERROR: /challenges/xp/me returning 404!")
        elif res.status_code == 200 or res.status_code == 401:
            print("SUCCESS: Route exists")

        # 4. Verify /challenges/streaks/me
        print("\nChecking GET /challenges/streaks/me...")
        res = await client.get(f"{BASE_URL}/challenges/streaks/me")
        print(f"Status: {res.status_code}")
        if res.status_code == 404:
            print("ERROR: /challenges/streaks/me returning 404!")
        elif res.status_code == 200 or res.status_code == 401:
            print("SUCCESS: Route exists")

if __name__ == "__main__":
    asyncio.run(verify_challenges_api())
