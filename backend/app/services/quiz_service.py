import json
import re
from openai import OpenAI
from app.core.config import settings
from app.services.embedding_service import embed_query
from app.services.vector_service import store

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def clean_json(text: str):
    """
    Removes ```json ``` wrappers from LLM output
    """
    text = text.strip()

    # remove ```json ... ```
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"```$", "", text)

    # remove generic ```
    text = text.replace("```", "")

    return text.strip()


def generate_quiz(topic: str, source_mode: str, num_questions: int, difficulty: str, quiz_type: str):

    context = ""

    if source_mode == "document":
        qvec = embed_query(topic)
        sources = store.search(qvec, top_k=settings.TOP_K)

        context = "\n\n".join([s["chunk_text"] for s in sources])

        prompt = f"""
Create a {quiz_type} quiz using ONLY the context.

CONTEXT:
{context}

Topic: {topic}
Number of questions: {num_questions}
Difficulty: {difficulty}

Return JSON only.
"""
    else:
        prompt = f"""
Create a {quiz_type} quiz.

Topic: {topic}
Number of questions: {num_questions}
Difficulty: {difficulty}

Return JSON only.
"""

    resp = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt
    )

    text = resp.output_text.strip()

    # clean markdown JSON blocks
    cleaned = clean_json(text)

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "topic": topic,
            "quiz_type": quiz_type,
            "raw_output": text
        }