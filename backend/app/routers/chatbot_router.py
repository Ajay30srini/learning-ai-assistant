from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.chatbot_schema import ChatbotRequest
from app.database.session import get_db
from app.repositories.chat_repo import create_chat_log
from app.services.chatbot_service import general_chat_answer

router = APIRouter(prefix="/chatbot", tags=["AI Chatbot"])

@router.post("/chat")
async def chatbot_chat(payload: ChatbotRequest, db: AsyncSession = Depends(get_db)):
    answer = general_chat_answer(payload.question)

    await create_chat_log(
        db,
        module="chatbot",
        session_id=payload.session_id,
        question=payload.question,
        answer=answer,
        sources=[]
    )

    return {
        "answer": answer
    }