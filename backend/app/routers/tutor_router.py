from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.tutor_schema import TutorChatRequest
from app.database.session import get_db
from app.repositories.chat_repo import create_chat_log
from app.services.rag_service import tutor_answer

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])

@router.post("/chat")
async def tutor_chat(payload: TutorChatRequest, db: AsyncSession = Depends(get_db)):
    answer, sources = tutor_answer(payload.question)

    await create_chat_log(
        db,
        module="tutor",
        session_id=payload.session_id,
        question=payload.question,
        answer=answer,
        sources=sources
    )

    return {
        "answer": answer,
        "sources": sources
    }