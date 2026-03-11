from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def general_chat_answer(question: str) -> str:
    prompt = f"""
You are a helpful AI learning assistant.
Answer clearly, simply, and accurately.

User question:
{question}
"""

    resp = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt
    )

    return resp.output_text.strip()