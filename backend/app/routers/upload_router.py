import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database.session import get_db
from app.repositories.document_repo import create_document
from app.services.parser_service import parse_document
from app.services.chunk_service import chunk_text
from app.services.embedding_service import embed_texts
from app.services.vector_service import store

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("")
async def upload_document(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    ext = (file.filename.split(".")[-1] or "").lower()
    if ext not in {"pdf", "docx", "txt"}:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, TXT supported")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    doc_id = str(uuid.uuid4())
    save_path = os.path.join(settings.UPLOAD_DIR, f"{doc_id}_{file.filename}")

    with open(save_path, "wb") as f:
        f.write(await file.read())

    pages = parse_document(save_path, ext)

    all_chunks = []
    metadata = []

    for page in pages:
        chunks = chunk_text(page["text"], settings.CHUNK_SIZE, settings.CHUNK_OVERLAP)
        for idx, ch in enumerate(chunks):
            all_chunks.append(ch)
            metadata.append({
                "doc_id": doc_id,
                "doc_name": file.filename,
                "page": page.get("page", 1),
                "chunk_id": f"{doc_id}_p{page.get('page',1)}_c{idx}",
                "chunk_text": ch
            })

    if all_chunks:
        vectors = embed_texts(all_chunks)
        store.add(vectors, metadata)

    await create_document(db, doc_id=doc_id, filename=file.filename, filepath=save_path)

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "chunks_indexed": len(all_chunks)
    }