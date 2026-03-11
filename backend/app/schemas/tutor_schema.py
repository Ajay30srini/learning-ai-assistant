from pydantic import BaseModel
from typing import Optional, Any

class TutorChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default"

class TutorChatResponse(BaseModel):
    answer: str
    sources: list[dict[str, Any]]