from app.database.database import AsyncSessionLocal, engine, Base

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

async def init_db():
    from app.models.document_model import Document
    from app.models.chat_log_model import ChatLog

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)