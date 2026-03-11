import os
import json
import numpy as np
import faiss
from app.core.config import settings

class FaissVectorStore:
    def __init__(self, dir_path: str):
        self.dir_path = dir_path
        os.makedirs(self.dir_path, exist_ok=True)

        self.index_path = os.path.join(self.dir_path, "index.faiss")
        self.meta_path = os.path.join(self.dir_path, "meta.json")

        self.index = None
        self.meta = []

        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.meta_path, "r", encoding="utf-8") as f:
                self.meta = json.load(f)

    def _init_index(self, dim: int):
        self.index = faiss.IndexFlatIP(dim)

    def add(self, vectors, metadata: list[dict]):
        vectors = np.array(vectors).astype("float32")

        if self.index is None:
            self._init_index(vectors.shape[1])

        self.index.add(vectors)
        self.meta.extend(metadata)
        self.save()

    def search(self, vector, top_k: int):
        if self.index is None or len(self.meta) == 0:
            return []

        v = np.array([vector]).astype("float32")
        scores, ids = self.index.search(v, top_k)

        results = []
        for score, idx in zip(scores[0], ids[0]):
            if idx == -1:
                continue
            item = dict(self.meta[idx])
            item["score"] = float(score)
            results.append(item)

        return results

    def save(self):
        if self.index is None:
            return
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump(self.meta, f, ensure_ascii=False, indent=2)

store = FaissVectorStore(settings.FAISS_DIR)