import numpy as np
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

# Lấy đường dẫn thư mục
curr_dir = Path(__file__).resolve().parent

# Lấy đường dẫn đến file database_vungtau.json
data_path = curr_dir.parent / 'data_test' / 'database_vungtau.json'

# Load database một lần khi module được import
try:
    with open(data_path, 'r', encoding='utf-8') as f:
        PLACES_DB = json.load(f)
except Exception as e:
    print(f"Warning: Không thể tải data_test/database_vungtau.json: {e}")
    PLACES_DB = []

def recommend_top_n_places(user_vector: List[float], places_db: Optional[List[Dict[str, Any]]] = None, top_n: int = 5):
    """
    Hàm tính toán và trả về Top N địa điểm phù hợp nhất với người dùng.
    - user_vector: list hoặc numpy array 8 chiều của người dùng.
    - places_db: list chứa các dictionary địa điểm. Nếu không truyền, dùng PLACES_DB mặc định.
    - top_n: số lượng địa điểm muốn gợi ý.
    """
    if places_db is None:
        places_db = PLACES_DB
        
    # 1. Chuẩn hóa vector đầu vào
    U = np.array(user_vector, dtype=float)
    norm_U = np.linalg.norm(U)
    
    # Rào chắn (Guardrail): Chống lỗi chia cho 0 nếu vector user là [0,0,..,0]
    if norm_U == 0:
        return []

    recommendations = []

    # 2. Quét qua toàn bộ Database để chấm điểm
    for place in places_db:
        # Ngăn lỗi nếu không tìm thấy vector
        if 'vector' not in place or not place['vector']:
            continue
            
        P = np.array(place['vector'], dtype=float)
        norm_P = np.linalg.norm(P)
        
        # Bỏ qua các địa điểm bị lỗi dữ liệu (vector rỗng)
        if norm_P == 0:
            continue
            
        # TÍNH TOÁN ĐỘ TƯƠNG ĐỒNG COSINE (Cosine Similarity)
        # Công thức: (U dot P) / (|U| * |P|)
        cosine_sim = np.dot(U, P) / (norm_U * norm_P)
        
        # Đóng gói kết quả
        recommendations.append({
            "place_id": place['id'],
            "name": place.get('metadata', {}).get('name', 'Unknown'),
            "match_score": round(cosine_sim * 100, 2), # Đổi ra thang điểm 100% cho Frontend dễ hiển thị
            "vector": place.get('vector', [])
        })
        
    # 3. Sắp xếp danh sách theo điểm số giảm dần (Từ khớp nhất đến ít khớp nhất)
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    
    # 4. Cắt lấy Top N
    return recommendations[:top_n]
