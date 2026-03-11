from openai import OpenAI
from app.core.config import settings
from app.services.embedding_service import embed_query
from app.services.vector_service import store

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def build_context(sources: list[dict]) -> str:
    blocks = []
    for i, s in enumerate(sources, start=1):
        blocks.append(
            f"[{i}] DOC: {s.get('doc_name')} | PAGE: {s.get('page')}\n{s.get('chunk_text')}"
        )
    return "\n\n".join(blocks)

def tutor_answer(question: str):
    qvec = embed_query(question)
    sources = store.search(qvec, top_k=settings.TOP_K)

    for s in sources:
        s["excerpt_for_highlight"] = s["chunk_text"][:220]

    context = build_context(sources)

    prompt = f"""
You are an AI Tutor.
Answer only from the retrieved document context.
If the answer is not found, say: "I don't know based on the uploaded content."

CONTEXT:
{context}

QUESTION:
{question}

Return only the answer text.
"""

    resp = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt
    )

    return resp.output_text.strip(), sources