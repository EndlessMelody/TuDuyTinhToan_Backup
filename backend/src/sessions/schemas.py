from pydantic import BaseModel
from typing import List, Literal

class InitSessionRequest(BaseModel):
    device_id: str
    domain: Literal["food", "place"] = "place"

class InitSessionResponse(BaseModel):
    user_id: str
    current_vector: List[float]
