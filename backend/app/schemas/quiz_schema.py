from pydantic import BaseModel
from typing import Optional, Literal

class QuizRequest(BaseModel):
    topic: str
    source_mode: Literal["general", "document"] = "general"
    num_questions: int = 5
    difficulty: Literal["easy", "medium", "hard"] = "easy"
    quiz_type: Literal["mcq", "short_answer", "true_false"] = "mcq"
    session_id: Optional[str] = "default"