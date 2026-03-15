from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import init_db

from app.routers.health_router import router as health_router
from app.routers.upload_router import router as upload_router
from app.routers.tutor_router import router as tutor_router
from app.routers.chatbot_router import router as chatbot_router
from app.routers.quiz_router import router as quiz_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(tutor_router)
app.include_router(chatbot_router)
app.include_router(quiz_router)