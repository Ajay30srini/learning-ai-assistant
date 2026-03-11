from app.models.document_model import Document

async def create_document(db, doc_id: str, filename: str, filepath: str):
    doc = Document(id=doc_id, filename=filename, filepath=filepath)
    db.add(doc)
    await db.commit()
    return doc