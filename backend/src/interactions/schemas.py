from pydantic import BaseModel
from typing import List, Literal, Union

class SwipeAction(BaseModel):
    place_id: int
    direction: Literal["RIGHT", "LEFT"]
    client_timestamp: float

class SwipeBatchRequest(BaseModel):
    user_id: Union[int, str]  # Hỗ trợ cả DB ID (int) và Guest UUID (str)
    domain: Literal["food", "place"] = "place"
    actions: List[SwipeAction]

class SwipeBatchResponse(BaseModel):
    status: str
    processed_count: int
    penalty_triggered: bool
    updated_vector: List[float]
