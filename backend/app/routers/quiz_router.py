from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.quiz_schema import QuizRequest
from app.database.session import get_db
from app.repositories.chat_repo import create_chat_log
from app.services.quiz_service import generate_quiz

router = APIRouter(prefix="/quiz", tags=["Quiz Generator"])

@router.post("/generate")
async def quiz_generate(payload: QuizRequest, db: AsyncSession = Depends(get_db)):
    quiz = generate_quiz(
        topic=payload.topic,
        source_mode=payload.source_mode,
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
        quiz_type=payload.quiz_type
    )

    await create_chat_log(
        db,
        module="quiz",
        session_id=payload.session_id,
        question=f"Generate quiz on: {payload.topic}",
        answer=str(quiz),
        sources=[]
    )

    return quiz