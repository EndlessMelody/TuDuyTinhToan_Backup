import json
import random
from pathlib import Path
from typing import List, Dict, Any

# Load dữ liệu từ file test
curr_dir = Path(__file__).resolve().parent
data_path = curr_dir.parent / 'data_test' / 'database_vungtau.json'

try:
    with open(data_path, 'r', encoding='utf-8') as f:
        PLACES_DB: List[Dict[str, Any]] = json.load(f)
except Exception as e:
    print(f"Warning: Không thể tải data_test/database_vungtau.json: {e}")
    PLACES_DB = []

def get_feed_cards(feed_type: str = "place", limit: int = 10) -> List[dict]:
    """
    Lấy danh sách thẻ để Frontend render.
    - feed_type: "food" hoặc "place" (hiện tại chỉ có place)
    - limit: số lượng thẻ cần trả về
    
    QUAN TRỌNG: KHÔNG trả về vector, Frontend không cần tính toán.
    """
    # Hiện tại chỉ có data place, sau này mở rộng thêm food
    if feed_type == "place":
        source_db = PLACES_DB
    else:
        # Placeholder: khi chưa có data food, trả mảng rỗng
        source_db = []
    
    if not source_db:
        return []
    
    # Trộn ngẫu nhiên, lấy `limit` thẻ
    shuffled = random.sample(source_db, min(limit, len(source_db)))
    
    # Chỉ trả metadata, LOẠI BỎ vector
    cards = []
    for place in shuffled:
        metadata = place.get('metadata', {})
        cards.append({
            "place_id": place['id'],
            "name": metadata.get('name', 'Unknown'),
            "image_url": metadata.get('image_url', ''),
            "category": metadata.get('category', ''),
            "coordinates": metadata.get('coordinates', None)
        })
    
    return cards
