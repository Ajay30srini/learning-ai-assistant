import json
from app.models.chat_log_model import ChatLog

async def create_chat_log(db, module: str, session_id: str | None, question: str, answer: str, sources=None):
    log = ChatLog(
        module=module,
        session_id=session_id,
        question=question,
        answer=answer,
        sources_json=json.dumps(sources or [], ensure_ascii=False)
    )
    db.add(log)
    await db.commit()
    return log