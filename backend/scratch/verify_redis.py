import asyncio
import sys
import os

# Add backend to sys.path to import src
sys.path.append(os.getcwd())

from src.main import InMemoryRedis

async def test_redis():
    print("Testing InMemoryRedis...")
    r = InMemoryRedis()
    
    # Test zincrby
    print("Test zincrby...")
    await r.zincrby("lb", 10.0, "user1")
    await r.zincrby("lb", 5.0, "user2")
    await r.zincrby("lb", 20.0, "user3")
    await r.zincrby("lb", 5.0, "user1") # total 15
    
    # Test zscore
    s1 = await r.zscore("lb", "user1")
    print(f"Score user1: {s1}")
    assert s1 == 15.0
    
    # Test zrevrange
    print("Test zrevrange...")
    range_all = await r.zrevrange("lb", 0, -1, withscores=True)
    print(f"Range all: {range_all}")
    assert range_all[0][0] == "user3" # 20.0
    assert range_all[1][0] == "user1" # 15.0
    assert range_all[2][0] == "user2" # 5.0
    
    slice_top2 = await r.zrevrange("lb", 0, 1)
    print(f"Top 2: {slice_top2}")
    assert slice_top2 == ["user3", "user1"]
    
    # Test zrevrank
    rank3 = await r.zrevrank("lb", "user3")
    print(f"Rank user3: {rank3}")
    assert rank3 == 0
    
    # Test pipeline
    print("Test pipeline...")
    pipe = r.pipeline()
    pipe.zincrby("lb", 100, "user2")
    pipe.zadd("lb", {"user4": 50})
    await pipe.execute()
    
    s2 = await r.zscore("lb", "user2")
    print(f"Score user2 after pipe: {s2}")
    assert s2 == 105.0
    
    s4 = await r.zscore("lb", "user4")
    print(f"Score user4 after pipe: {s4}")
    assert s4 == 50.0
    
    print("✅ All mocks passed!")

if __name__ == "__main__":
    asyncio.run(test_redis())
