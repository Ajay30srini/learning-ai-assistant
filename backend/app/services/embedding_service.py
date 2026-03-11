from sentence_transformers import SentenceTransformer

_model = None

def get_embedder():
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _model

def embed_texts(texts: list[str]):
    model = get_embedder()
    return model.encode(texts, normalize_embeddings=True)

def embed_query(query: str):
    model = get_embedder()
    return model.encode([query], normalize_embeddings=True)[0]