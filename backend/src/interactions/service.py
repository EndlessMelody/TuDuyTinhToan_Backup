import json
import numpy as np
from typing import List, Dict, Any
import redis.asyncio as aioredis
from src.recommendations.service import PLACES_DB

# Hằng số thuật toán
ALPHA_NORMAL = 0.1       # Hệ số học bình thường
ALPHA_PENALTY = 0.01     # Hệ số học khi bị phạt (vuốt quá nhanh)
PENALTY_THRESHOLD = 0.5  # Ngưỡng thời gian tối thiểu giữa 2 lần vuốt (giây)

def _get_place_vector(place_id: int) -> np.ndarray | None:
    """
    Tìm vector của địa điểm theo ID từ database đã load sẵn.
    """
    for place in PLACES_DB:
        if place['id'] == place_id:
            return np.array(place['vector'], dtype=float)
    return None


async def process_swipe_batch(
    redis: aioredis.Redis,
    user_id: str,
    domain: str,
    actions: List[Dict[str, Any]]
) -> dict:
    """
    Xử lý một batch vuốt và cập nhật vector người dùng.
    
    Thuật toán Active Learning:
    - RIGHT (Thích): U_new = U_old + α * P
    - LEFT  (Không thích): U_new = U_old - α * P
    
    Penalty (Phạt vuốt nhanh):
    - Nếu khoảng cách giữa 2 lần vuốt < 0.5 giây → α giảm từ 0.1 xuống 0.01
    - Ý nghĩa: Vuốt quá nhanh = người dùng không thực sự suy nghĩ → ít ảnh hưởng đến vector
    """
    # Tìm user trên Redis bằng device_id thông qua user_id
    # Scan tất cả key user:{domain}:* để tìm key chứa user_id này
    user_key = None
    cursor = 0
    pattern = f"user:{domain}:*"
    
    while True:
        cursor, keys = await redis.scan(cursor=cursor, match=pattern, count=100)
        for key in keys:
            data = await redis.get(key)
            if data:
                parsed = json.loads(data)
                if parsed.get("user_id") == user_id:
                    user_key = key
                    break
        if user_key or cursor == 0:
            break
    
    if not user_key:
        return {
            "status": "error",
            "processed_count": 0,
            "penalty_triggered": False,
            "updated_vector": []
        }
    
    # Lấy vector hiện tại của user
    user_data = json.loads(await redis.get(user_key))
    U = np.array(user_data["vector"], dtype=float)
    
    processed_count = 0
    penalty_triggered = False
    
    # Sắp xếp actions theo timestamp để đảm bảo đúng thứ tự
    sorted_actions = sorted(actions, key=lambda a: a["client_timestamp"])
    
    for i, action in enumerate(sorted_actions):
        place_id = action["place_id"]
        direction = action["direction"]
        timestamp = action["client_timestamp"]
        
        # Lấy vector địa điểm
        P = _get_place_vector(place_id)
        if P is None:
            continue  # Bỏ qua nếu không tìm thấy địa điểm
        
        # Kiểm tra Penalty: vuốt quá nhanh?
        alpha = ALPHA_NORMAL
        if i > 0:
            prev_timestamp = sorted_actions[i - 1]["client_timestamp"]
            time_diff = timestamp - prev_timestamp
            if time_diff < PENALTY_THRESHOLD:
                alpha = ALPHA_PENALTY
                penalty_triggered = True
        
        # Áp dụng thuật toán Active Learning
        if direction == "RIGHT":
            U = U + alpha * P   # Thích → kéo vector user về phía địa điểm
        elif direction == "LEFT":
            U = U - alpha * P   # Không thích → đẩy vector user ra xa địa điểm
        
        # Clamp vector về khoảng [0, 1] để giữ giá trị hợp lệ
        U = np.clip(U, 0.0, 1.0)
        
        processed_count += 1
    
    # Lưu vector mới vào Redis
    updated_vector = [round(float(x), 4) for x in U]
    user_data["vector"] = updated_vector
    await redis.set(user_key, json.dumps(user_data))
    
    return {
        "status": "success",
        "processed_count": processed_count,
        "penalty_triggered": penalty_triggered,
        "updated_vector": updated_vector
    }
