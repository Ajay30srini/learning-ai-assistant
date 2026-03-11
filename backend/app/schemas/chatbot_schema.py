from pydantic import BaseModel
from typing import Optional

class ChatbotRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default"

class ChatbotResponse(BaseModel):
    answer: str